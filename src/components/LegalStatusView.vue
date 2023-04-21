<template>
	<view-wrapper is-borderless>
		<template #title>{{ $t('legalStatus.title') }}</template>
		<b-loading v-model="isLoading">
			<font-awesome-icon :icon="['fas', 'sync-alt']" spin size="6x"></font-awesome-icon>
		</b-loading>
		<async-data-table
			v-if="!isLoading"
			:data="legalStatus"
			:total="legalStatusTotalCount"
			:columns="columns"
			:items-per-page.sync="itemsPerPage"
			:is-loading="isLoadingLegalStatus"
			:page.sync="page"
			@refresh-data="onRefreshDataAsync"
			@click="onLegalStatusSelect">
			<template v-slot:menu-primary-front>
				<a target="_blank" :href="xlsxExportUrl" class="navbar-item">
					Export
				</a>
			</template>
		</async-data-table>
	</view-wrapper>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { cloneDeep, isEmpty, find, map, size, isArray } from 'lodash';
import AsyncDataTableComponent from 'lanxess-frontend/vuejs/components/async-data-table/AsyncDataTableComponent.vue';
import { DataQuerySearchFilter } from 'lanxess-frontend/vuejs/components/async-data-table/DataQuery';
import { Column, ValueSetItem, applyValueSet, DataType } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
// import { Columns, defaultView } from '../helpers/columns';
import { columnsToOdataQuery, createOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/OdataQuery';
import { toOdataQuery as searchToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/SearchFilter.vue';
import { toOdataQuery as valueSetToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/ValueSetFilter.vue';
import { toOdataQuery as dateRangeToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/DateRangeFilterComponent.vue';
import { Permission } from '../models/Claim'
import { statuses } from '../helpers/constants';
import saveState from 'vue-save-state-session';
import i18n from '~/plugins/i18n'
// import { Column, View, ViewColumn, ColumnBaseType, DataType, ValueSetItem } from 'lanxess-frontend/vuejs/components/async-data-table/Column'


const defaultSearchFilter = {
	component: 'async-data-table-filter-search',
	id: 'search'
};
const defaultValueSetFilter = {
	component: 'async-data-table-filter-value-set',
	id: 'valueSet'
};

const columns = [

	Column.create({
		field: 'id',
		label: 'ID',
		baseType: DataType.Guid,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
		],
		isVisible: false
	}),
	Column.create({
		field: 'substance',
		label: 'Substance',
		baseType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid
	}),
	Column.create({
		field: 'substanceId',
		label: 'Substance Id',
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'substanceId',
		idPath: 'id',
		idDataType: DataType.Guid,
		isVisible: false
	}),
	Column.create({
		id: 'legislation',
		field: 'legislationStatus.legislation',
		label: 'Legislation',
		baseType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid
	}),
	Column.create({
		id: 'area',
		field: 'legislationStatus.legislation.area',
		label: 'Area',
		isEditable: false,
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid
	}),
	Column.create({
		field: 'legalEntity',
		label: 'Originator',
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid
	}),
	Column.create({
		field: 'representative',
		label: 'Representative',
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid
	}),
	Column.create({
		field: 'legislationStatus',
		label: 'Legal Status',
		isEditable: false,
		dataType: DataType.Object,
		displayPath: 'name',
		idPath: 'id',
		isSortable: false,
		idDataType: DataType.Guid
	}),
	Column.create({
		field: 'tonnageName',
		label: 'Tonnage',
		isEditable: false,
		dataType: DataType.String,
		isSortable: false
	}),
	Column.create({
		field: 'flags',
		label: 'Flags',
		isEditable: false,
		dataType: DataType.ArrayOfString,
		isSortable: false
	}),
	Column.create({
		field: 'status',
		label: 'Status',
		baseType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid
	}),
	Column.create({
		id: 'expiresOn',
		field: 'expiresOn',
		label: 'Expires On',
		component: 'date-picker-cell',
		dataType: DataType.Date,
		isEditable: false,
		meta: {
			dateFormat: i18n.t('format.shortDate')
		}
	}),
	new Column('bu', true, 'Business Unit', DataType.String, true, [defaultSearchFilter], null, null, null, null, true), 
	new Column('registrationNumber', false, 'Registration Number', DataType.String, true, [defaultSearchFilter], null, null, null, null, true), 
	// Column.create({
	// 	field: 'bu',
	// 	label: 'Business Unit',
	// 	baseType: DataType.Object,
	// 	filters: [
	// 		{ component: 'async-data-table-filter-search', id: 'search' },
	// 		{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
	// 	],
	// 	displayPath: 'abbreviation',
	// 	idPath: 'id',
	// 	idDataType: DataType.Guid
	// }),
	Column.create({
		id: 'validOn',
		field: 'validOn',
		label: 'Valid On',
		component: 'date-picker-cell',
		dataType: DataType.Date,
		meta: {
			dateFormat: i18n.t('format.shortDate')
		},
		filters: [
			//{ component: 'async-data-table-filter-search', id: 'search' },
			// { component: 'async-data-table-filter-value-set', id: 'valueSet' },
			{ component: 'async-data-table-filter-date-range', id: 'dateRange' }
		]
	}),
];


export default {
	components: {
		'async-data-table': AsyncDataTableComponent
	},

	dependencies: [
		'getLegalStatusService',
		'getLegalEntitiesService',
		'getLegislationsService',
		'getAllLegalStatusInstanceStatusService',
		'getBusinessUnitsService',
		'getDistinctIdentifierKeysService',
		'getAreasService',
		'getSubstancesService',
		'getCurrentUserService',
		'getLegalStatusXlsxExportUrlService'],

	data() {
		return {
			legalStatus: [],
			legalStatusTotalCount: 0,
			isLoadingLegalStatus: false,
			itemsPerPage: 10,
			page: 1,
			isLoading: true,
			columns: columns.slice(),
			currentUser: null,
			canEdit: true
		};
	},

	activated() {
		console.info('ACTIVATED');
	},

	deactivated() {
		console.info('DEACTIVATED');
	},

	destroyed() {
		console.info('DESTROYED');
	},

	created: async function () {
		let promises = [];
		// areas
		promises.push(this.getAreasService.getAsync().then(v => applyValueSet(this.columns, 'area', v)));

		// business units
		promises.push(this.getBusinessUnitsService.getAsync().then(v => applyValueSet(this.columns, 'bu', v)));

		// legal entities
		promises.push(this.getLegalEntitiesService.getAsync().then(v => applyValueSet(this.columns, 'legalEntity', v, i=> i.sapL4PId  + ' - ' + i.name)));

		//representative
		promises.push(this.getLegalEntitiesService.getAsync().then(v => applyValueSet(this.columns, 'representative', v, i=> i.sapL4PId  + ' - ' + i.name)));

		// substances
		promises.push(this.getSubstancesService.getAsync().then(v => applyValueSet(this.columns, 'substance', v)));

		// // legislations
		promises.push(this.getLegislationsService.getAsync().then(v => applyValueSet(this.columns, 'legislation', v)));

		// legal status instance status
		promises.push(this.getAllLegalStatusInstanceStatusService.getAsync().then(v => applyValueSet(this.columns, 'status', v)));

		promises.push(this.getSubstancesService.getAsync().then((v) => applyValueSet(this.columns, 'substanceId', v, i=> i.id)));

		// identifier columns
		promises.push(this.getDistinctIdentifierKeysService.getAsync().then(keys => {
			for (const key of keys) {
				this.columns.push(
					Column.create({
						id: `identifier-${key}`,
						field: 'substance.identifiers',
						isVisible: true,
						isSortable: true,
						isSearchable: true,
						label: `${key}`,
						component: 'single-identifier',
						isCollection: true,
						displayPath: 'value',
						oneOfCollectionKeyPath: 'key',
						oneOfCollectionKeyValue: key,
						order: 1,
						filters: [
							{ component: 'async-data-table-filter-search', id: 'search' }
						],
						meta: {
							identifierKey: key
						},
						sortCallback: (order) => {
							return `orderByIdentifier=${key},${order}`;
						}
					})
				);
			}
		}));



		// get current user
		promises.push(this.getCurrentUserService.getAsync().then(user => {
			this.currentUser = user;
			if (user?.aggregatedClaims.length == 1) {
				this.canEdit = user.aggregatedClaims[0].value != 'bu users'
			}
		}));

		
		await Promise.all(promises);
		await this.onRefreshDataAsync();
		this.isLoading = false;
	},

	computed: {
		xlsxExportUrl() {
			if (!this.columns) return '';

			let resColumns = [];
			for (const column of this.columns) {
				if (column.isVisible) resColumns.push(column.id);
			}
			
			return this.getLegalStatusXlsxExportUrlService.get(this.legalStatusQueryString, resColumns);
		},

		user() {
			return this.$store.state.user.user;
		},

		legalStatusQueryString() {
			let queryString = createOdataQuery(this.itemsPerPage, this.page);

			let queries = columnsToOdataQuery(this.columns, {
				search: searchToOdataQuery,
				valueSet: [valueSetToOdataQuery, 'Guid'],
				dateRange: dateRangeToOdataQuery
			});

			if (queries && queries.filter && queries.filter.length > 0) queryString += '&$filter=' + queries.filter;

			if (queries && queries.sort && queries.sort.length > 0) queryString += '&$orderby=' + queries.sort;

			if (queries && queries.additional && queries.additional.length > 0) queryString += '&' + queries.additional;
			// if (queries && queries.filter && queries.filter.length > 0)
			// 	queryString += '&$filter=' + queries.filter;

			// if (queries && queries.sort && queries.sort.length > 0)
			// 	queryString += '&$orderby=' + queries.sort;

			return queryString;
		},
	},

	methods: {
		onLegalStatusSelect(legalStatusInstance) {
			if(this.canEdit)
			{
				this.$router.push(`/legalStatus/${legalStatusInstance.id}`);
			}
		},

		async onRefreshDataAsync() {
			this.isLoadingLegalStatus = true;
			try {
				let queryString = this.legalStatusQueryString;
				console.log("query", queryString, this.page);
				const responseData = await this.getLegalStatusService.getAsync(queryString);

				console.log('response', responseData);
				this.legalStatus = responseData.items;
				this.legalStatusTotalCount = responseData.totalCount;
			} catch (e) {
				console.error('Error occured during loading of projects', e);
			} finally {
				this.isLoadingLegalStatus = false;
			}
		},
	}
};
</script>

<style lang="scss" scoped>
	.selector-action {
		&.select-all {
			max-width: 195px;
		}
	}

	table {
		& th,
		& td {
			white-space: nowrap;
			vertical-align: middle !important;
		}

		& th {
			border-top: none !important;
		}

		& td {
			padding: 0;
			position: relative;
		}
	}
</style>
