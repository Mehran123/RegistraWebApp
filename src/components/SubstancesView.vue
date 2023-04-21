<template>
	<view-wrapper is-borderless>
		<template #title>{{ $t('substances.title') }}</template>
		<b-loading v-model="isLoading">
			<font-awesome-icon :icon="['fas', 'sync-alt']" spin size="6x"></font-awesome-icon>
		</b-loading>
		<async-data-table
			v-if="!isLoading"
			:data="substances"
			:total="substancesTotalCount"
			:columns="columns"
			:items-per-page.sync="itemsPerPage"
			:is-loading="isLoadingSubstances"
			:page.sync="page"
			@refresh-data="onRefreshDataAsync"
			@click="onRowClick">
			<template v-slot:menu-primary-front>				
				<router-link to="/substances/create" class="navbar-item" v-if="canEdit">
					<font-awesome-icon :icon="['fas', 'plus']" class="mr-2"></font-awesome-icon>
					{{ $t('addSubstance.label') }}
				</router-link>			
				<a target="_blank" :href="xlsxExportUrl" class="navbar-item">
					Export
				</a>
			</template>
		</async-data-table>
	</view-wrapper>
</template>

<script>
import AsyncDataTableComponent from 'lanxess-frontend/vuejs/components/async-data-table/AsyncDataTableComponent.vue';
import { DataQuerySearchFilter } from 'lanxess-frontend/vuejs/components/async-data-table/DataQuery';
import { Column, ValueSetItem, applyValueSet, DataType } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
import { columnsToOdataQuery, createOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/OdataQuery';
import { toOdataQuery as searchToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/SearchFilter.vue';
import { toOdataQuery as valueSetToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/ValueSetFilter.vue';
import { toOdataQuery as dateRangeToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/DateRangeFilterComponent.vue';
import { Permission } from '../models/Claim'
import { statuses } from '../helpers/constants';
import saveState from 'vue-save-state-session';
import { defaultValueSet as defaultThreeStateBooleanValueSet } from 'lanxess-frontend/vuejs/components/ThreeStateBooleanRwInputComponent.vue';

const defaultSearchFilter = {
	component: 'async-data-table-filter-search',
	id: 'search'
};
const defaultValueSetFilter = {
	component: 'async-data-table-filter-value-set',
	id: 'valueSet'
};

const columns = [
	new Column('name', true, 'Name', DataType.String, true, [defaultSearchFilter]),
	new Column('specificationId', true, 'Specification Id', DataType.String, true, [defaultSearchFilter]),
	new Column('id', false, 'Substance Id', DataType.Guid, true, [defaultSearchFilter]),
	Column.create({
		field: 'dossierQuality',
		label: 'Dossier Quality',
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
		field: 'expertUser', 
		label: 'Substance Expert',
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
		field: 'gpM4',
		label: 'GPM4',
		dataType: DataType.Boolean,
		component: 'input-three-state-boolean-rw',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		valueSet: defaultThreeStateBooleanValueSet,
	}),
];


export default {
	activated() {
		console.info('ACTIVATED');
	},

	deactivated() {
		console.info('DEACTIVATED');
	},

	destroyed() {
		console.info('DESTROYED');
	},
	components: {
		'async-data-table': AsyncDataTableComponent
	},

	dependencies: [
		'getSubstancesService',
		'getDossierQualitiesService',
		'getDistinctIdentifierKeysService',
		'getUsersService',
		'getSubstancesXlsxExportUrlService',
		'getCurrentUserService',
		'getLegislationsService',
		'getSubstanceTypesService',
		'getSubstanceTypesService',
		'checkClaimsService'
	],

	data() {
		return {
			substances: [],
			substancesTotalCount: 0,
			isLoadingSubstances: false,
			itemsPerPage: 10,
			page: 1,
			isLoading: true,
			columns: columns.slice(),
			currentUser: null,
			canEdit: true,
			firstLoadview : true
		};
	},

	created: async function () {
		let promises = [];

		// business units
		promises.push(this.getDossierQualitiesService.getAsync().then(v => applyValueSet(this.columns, 'dossierQuality', v)));

		// // legislations
		promises.push(this.getLegislationsService.getAsync().then(v => applyValueSet(this.columns, 'legislation', v, i=> i.name  + ' ( ' + i.area.code + ' ) ')));

		// SubstanceTypes
		promises.push(this.getSubstanceTypesService.getAsync().then(v => applyValueSet(this.columns, 'substanceType', v, i=>i.name)));


		// manager
		promises.push(this.getUsersService.getAsync().then(users => {
			applyValueSet(this.columns, 'expertUser', users);
		}));


		// identifier columns
		promises.push(this.getDistinctIdentifierKeysService.getAsync().then(keys => {
			for (const key of keys) {
				this.columns.push(
					Column.create({
						id: `identifier-${key}`,
						field: 'identifiers',
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

		promises.push(this.getCurrentUserService.getAsync().then(user => {
			this.currentUser = user;
			this.canEdit =this.checkClaimsService.canManageAnyArea(this.currentUser);
			if (user?.aggregatedClaims.length == 1) {
				// this.canEdit = user.aggregatedClaims[0].value != 'bu users'
				this.canEdit =this.checkClaimsService.canManageAnyArea(this.currentUser);
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
			
			return this.getSubstancesXlsxExportUrlService.get(this.substancesQueryString, resColumns);
		},
		// canAddSubstance() {
		// 	if (!this.currentUser || !isArray(this.currentUser.claims)) return false;

		// 	return this.checkClaimsService.canManageAnyArea(this.currentUser);
		
		// },
		user() {
			return this.$store.state.user.user;
		},

		substancesQueryString() {
			let queryString = createOdataQuery(this.itemsPerPage, this.page);

			let queries = columnsToOdataQuery(this.columns, {
				search: searchToOdataQuery,
				valueSet: [valueSetToOdataQuery, 'Guid'],
				dateRange: dateRangeToOdataQuery
			});

			if (queries && queries.filter && queries.filter.length > 0) queryString += '&$filter=' + queries.filter;

			if (queries && queries.sort && queries.sort.length > 0) queryString += '&$orderby=' + queries.sort;

			if (queries && queries.additional && queries.additional.length > 0) queryString += '&' + queries.additional;

			return queryString;
		},
	},

	methods: {
		async onRefreshDataAsync() {
			if (this.firstLoadview) {
				this.isLoadingSubstances = true;
			try {
				let queryString = this.substancesQueryString;
				const responseData = await this.getSubstancesService.getAsync(queryString);
				this.substances = responseData.items;
				this.substancesTotalCount = responseData.totalCount;
			} catch (e) {
				console.error('Error occured during loading of substances', e);
			} finally {
				this.isLoadingSubstances = false;
			}
			}
			
		},

		onRowClick(substance) {
			if(this.canEdit)
			{
				this.$router.push(`/substances/${substance.id}`);
			}
		}
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
