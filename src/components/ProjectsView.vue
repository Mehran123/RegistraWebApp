<template>
	<view-wrapper is-borderless>
		<template #title>{{ $t('projectOverview.title') }}</template>
		<b-loading v-model="isLoading">
			<font-awesome-icon :icon="['fas', 'sync-alt']" spin size="6x"></font-awesome-icon>
		</b-loading>
		<async-data-table
			v-if="!isLoading"
			:data="projects"
			:total="projectsTotalCount"
			:page.sync="page"
			:columns="columns"
			:items-per-page.sync="itemsPerPage"
			:views="views"
			:is-loading="isLoadingProjects"
			:enable-views="true"
			:enable-custom-views="true"
			:is-initialized="isRestored"
			:current-view.sync="currentView"
			:default-view="newDefaultView"
			:allow-quick-edit="canAdminProjects"
			@refresh-data="onRefreshDataAsync"
			@save-view="onSaveViewAsync"
			@delete-view="onDeleteViewAsync"
			@save-data="onSaveDataAsync">
			<template v-slot:menu-primary-front>
				<router-link to="/projects/create" class="navbar-item" v-if="canAddProject">
					<font-awesome-icon :icon="['fas', 'plus']" class="mr-2"></font-awesome-icon>
					{{ $t('addProject.label') }}
				</router-link>
				<a target="_blank" :href="xlsxExportUrl" class="navbar-item">
					Export
				</a>
			</template>
		</async-data-table>
	</view-wrapper>
</template>

<script>
import { find, size, isArray, isObject } from 'lodash';
import AsyncDataTableComponent from 'lanxess-frontend/vuejs/components/async-data-table/AsyncDataTableComponent.vue';
import { DataQuerySearchFilter } from 'lanxess-frontend/vuejs/components/async-data-table/DataQuery';
import { Column, applyValueSet, DataType, ViewColumn, View, extractViewColumns } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
import { columnsToOdataQuery, createOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/OdataQuery';
import { toOdataQuery as searchToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/SearchFilter.vue';
import { toOdataQuery as valueSetToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/ValueSetFilter.vue';
import { toOdataQuery as dateRangeToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/DateRangeFilterComponent.vue';
import { toOdataQuery as tagsToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/TagsFilterComponent.vue';
import { toOdataQuery as legislationStatusOdataQuery } from '../components/shared/async-data-table/LegislationStatusInstanceFilterComponent.vue';
import { Permission } from '../models/Claim';
import { statuses } from '../helpers/constants';
import i18n from '../plugins/i18n'

//#region columns
import { defaultValueSet as defaultThreeStateBooleanValueSet } from 'lanxess-frontend/vuejs/components/ThreeStateBooleanRwInputComponent.vue';

const defaultView = new View(null, 'Default View');
defaultView.isDefault = true;
defaultView.itemsPerPage = 10;
defaultView.isEditable = false;
defaultView.type = 'System';
defaultView.columns.push(new ViewColumn('#actions', null, {}, true, 0));
defaultView.columns.push(new ViewColumn('no', 'desc', {}, true, 1));
defaultView.columns.push(new ViewColumn('name', null, {}, true, 2));
defaultView.columns.push(new ViewColumn('area', null, {}, true, 3));
defaultView.columns.push(new ViewColumn('isDisabled', null, {"valueSet": [false]}, true, 4));

const defaultPhasesView = new View(null, 'Phases');
defaultPhasesView.isDefault = false;
defaultPhasesView.itemsPerPage = 10;
defaultPhasesView.isEditable = false;
defaultPhasesView.type = 'System';
defaultPhasesView.columns.push(new ViewColumn('#actions', null, {}, true, 0));
defaultPhasesView.columns.push(new ViewColumn('no', 'desc', {}, true, 1));
defaultPhasesView.columns.push(new ViewColumn('name',null, {}, true, 2));
defaultPhasesView.columns.push(new ViewColumn('area', null, {}, true, 3));
defaultPhasesView.columns.push(new ViewColumn('phase-1', null, {}, true, 4));
defaultPhasesView.columns.push(new ViewColumn('phase-2', null, {}, true, 5));
defaultPhasesView.columns.push(new ViewColumn('phase-3', null, {}, true, 6));
defaultPhasesView.columns.push(new ViewColumn('phase-4', null, {}, true, 7));
defaultPhasesView.columns.push(new ViewColumn('phase-5', null, {}, true, 8));
defaultPhasesView.columns.push(new ViewColumn('phase-6', null, {}, true, 9));
defaultPhasesView.columns.push(new ViewColumn('isDisabled', null, {"valueSet": [false]}, true,10));

const newDefaultView = new View(null, 'New Default View');
newDefaultView.isDefault = false;
newDefaultView.itemsPerPage = 10;
newDefaultView.isEditable = false;
newDefaultView.type = 'System';
newDefaultView.columns.push(new ViewColumn('#actions', null, {}, true, 0));
newDefaultView.columns.push(new ViewColumn('no', 'desc', {}, true, 1));
newDefaultView.columns.push(new ViewColumn('name', null, {}, true, 2));
newDefaultView.columns.push(new ViewColumn('identifier-CAS', null, {}, true, 3));
newDefaultView.columns.push(new ViewColumn('identifier-EC', null, {}, true, 4));
newDefaultView.columns.push(new ViewColumn('status', null, {}, true, 5));
newDefaultView.columns.push(new ViewColumn('targetLegislationStatus', null, {}, true, 6));
newDefaultView.columns.push(new ViewColumn('currentLegislationStatus', null, {}, true, 7));
newDefaultView.columns.push(new ViewColumn('isUpdate', null, {}, true, 8));
newDefaultView.columns.push(new ViewColumn('legislation', null, {}, true, 9));
newDefaultView.columns.push(new ViewColumn('area', null, {}, true, 10));
newDefaultView.columns.push(new ViewColumn('deadline', null, {}, true, 11));
newDefaultView.columns.push(new ViewColumn('businessUnit', null, {}, true, 12));
newDefaultView.columns.push(new ViewColumn('legalEntity', null, {}, true, 14));
newDefaultView.columns.push(new ViewColumn('manager', null, {}, true, 14));
newDefaultView.columns.push(new ViewColumn('localManager', null, {}, true, 15));
newDefaultView.columns.push(new ViewColumn('expertUser', null, {}, true, 16));
newDefaultView.columns.push(new ViewColumn('ceficCode', null, {}, true, 17));
newDefaultView.columns.push(new ViewColumn('isDisabled', null, {"valueSet": [false]}, true, 18));
newDefaultView.columns.push(new ViewColumn('isLabelingRequired', null, {"valueSet": [false]}, true, 18));
newDefaultView.columns.push(new ViewColumn('isEsdsRequired', null, {"valueSet": [false]}, true, 18));

const defaultSearchFilter = {
	component: 'async-data-table-filter-search',
	id: 'search',
};
const defaultValueSetFilter = {
	component: 'async-data-table-filter-value-set',
	id: 'valueSet',
};
const defaultTagsFilter = {
	component: 'async-data-table-filter-tags',
	id: 'tags',
};

let columnOrder = 4;

let columns = [
	Column.create({
		id: '#actions',
		isVisible: true,
		sticky: true,
		label: 'Actions',
		component: 'projects-list-actions-cell',
		width: '120px',
		isSortable: false,
		order: 0,
	}),

	new Column('no', true, 'No', DataType.Number, true, [defaultSearchFilter], null, null, null, null, false, ++columnOrder),
	new Column('name', true, 'Name', DataType.String, true, [defaultSearchFilter], null, null, null, null, true, ++columnOrder),
	new Column('leadProjectNo', false, 'Lead Project', DataType.String, true, [defaultSearchFilter], null, null, null, null, true, ++columnOrder), 

	Column.create({
		field: 'tags',
		label: 'Tags',
		isEditable: false,
		component: 'tags-rw',
		isSortable: false,
		filters: [defaultTagsFilter],
		order: ++columnOrder,
	}),

	Column.create({
		field: 'targetLegislationStatus',
		label: 'Target Legal Status',
		isEditable: false,
		filters: [{ id: 'legislationStatus', component: 'async-data-table-filter-legislation-status' }],
		component: 'legislation-status',
		dataType: DataType.Object,
		// dataType: DataType.ArrayOfObject,
		displayPath: 'name',
		idPath: 'id',
		isSortable: false, 
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'currentLegislationStatus',
		label: 'Current Legal Status',
		isEditable: false,
		dataType: DataType.Object,
		component: 'current-legislation-status',
		isSortable: false,
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'substance',
		label: 'Substance',
		baseType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'type',
		label: 'Project Type',
		baseType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'legislation',
		label: 'Legislation',
		baseType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'manager',
		label: 'Responsible',
		component: 'people-selector-cell',
		idPath: 'id',
		dataType: DataType.Object,
		idDataType: DataType.Guid,
		referencePath: 'managerUserId',
		displayPath: 'name',
		filters: [defaultSearchFilter, defaultValueSetFilter],
		isSortable: true,
		order: ++columnOrder,
	}),
	Column.create({
		field: 'businessUnitContact',
		label: 'BU Contact',
		component: 'people-selector-cell',
		idPath: 'id',
		dataType: DataType.Object,
		idDataType: DataType.Guid,
		referencePath: 'businessUnitContactUserId',
		displayPath: 'name',
		filters: [defaultSearchFilter, defaultValueSetFilter],
		isSortable: true,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'businessUnit',
		label: 'BU',
		baseType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'abbreviation',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	new Column('businessLine', true, 'BL', DataType.String, true, [defaultSearchFilter], null, null, null, null, true, ++columnOrder),
	Column.create({
		field: 'area',
		label: 'Area',
		isEditable: false,
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'legalEntity',
		label: 'Originator',
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'sapL4PId',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),
	Column.create({
		field: 'representative',
		label: 'Representative',
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'sapL4PId',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'status',
		label: 'Status',
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		id: 'deadline',
		field: 'deadline',
		label: 'Deadline',
		component: 'date-picker-cell',
		dataType: DataType.Date,
		meta: {
			dateFormat: i18n.t('format.shortDate'),
		},
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-date-range', id: 'dateRange' },
		],
		order: ++columnOrder,
	}),

	Column.create({
		field: 'localManager',
		label: 'Local Responsible',
		component: 'people-selector-cell',
		idPath: 'id',
		dataType: DataType.Object,
		idDataType: DataType.Guid,
		referencePath: 'managerUserId',
		displayPath: 'name',
		filters: [defaultSearchFilter, defaultValueSetFilter],
		isSortable: true,
		order: ++columnOrder,
	}),

	Column.create({
		id: 'registrationValidUntil',
		field: 'registrationValidUntil',
		label: 'Expiry date',
		dataType: DataType.Date,
		isEditable: false,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'ceficCode',
		label: 'Cefic Code',
		dataType: DataType.Object,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
		],
		displayPath: 'name',
		idPath: 'id',
		idDataType: DataType.Guid,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'isConsortium',
		label: 'Consortium',
		dataType: DataType.Boolean,
		component: 'input-three-state-boolean-rw',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		valueSet: defaultThreeStateBooleanValueSet,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'gpM4',
		label: 'GPM4',
		dataType: DataType.Boolean,
		component: 'input-three-state-boolean-rw',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		valueSet: defaultThreeStateBooleanValueSet,
	}),

	Column.create({
		field: 'isUpdate',
		label: 'Update',
		dataType: DataType.Boolean,
		component: 'input-three-state-boolean-rw',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		valueSet: defaultThreeStateBooleanValueSet,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'isDisabled',
		label: 'Disabled',
		dataType: DataType.Boolean,
		component: 'input-three-state-boolean-rw',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		valueSet: defaultThreeStateBooleanValueSet,
		order: ++columnOrder,
	}),
	Column.create({
		field: 'isLabelingRequired',
		label: 'Labeling Required',
		dataType: DataType.Boolean,
		component: 'input-three-state-boolean-rw',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		valueSet: defaultThreeStateBooleanValueSet,
		order: ++columnOrder,
	}),
	Column.create({
		field: 'isEsdsRequired',
		label: 'eSDS Required',
		dataType: DataType.Boolean,
		component: 'input-three-state-boolean-rw',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		valueSet: defaultThreeStateBooleanValueSet,
		order: ++columnOrder,
	}),

	Column.create({
		field: 'substance.expertUser',
		id: 'expertUser',
		label: 'Substance Expert',
		dataType: DataType.Object,
		component: 'people-selector-cell',
		filters: [{ component: 'async-data-table-filter-value-set', id: 'valueSet' }],
		idPath: 'id',
		isSortable: false,
		idDataType: DataType.Guid,
		order: ++columnOrder,
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
		order: ++columnOrder,
	}),
	new Column('registrationNumber', false, 'RegistrationNumber', DataType.String, true, [defaultSearchFilter], null, null, null, null, true, ++columnOrder),
	Column.create({
		id: 'registrationAtAuthorityOn',
		field: 'registrationAtAuthorityOn',
		label: 'Registration Date',
		component: 'date-picker-cell',
		dataType: DataType.Date,
		meta: {
			dateFormat: i18n.t('format.shortDate'),
		},
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-date-range', id: 'dateRange' },
		],
		order: ++columnOrder,
	}),

];

//#endregion

export default {
	components: {
		'async-data-table': AsyncDataTableComponent,
	},

	dependencies: ['getLegislationStatusService', 'getLegislationsService', 'getProjectsService', 'getLegalEntitiesService', 'getBusinessUnitsService', 'getCeficCodesService', 'getDistinctIdentifierKeysService', 'getUsersService', 'getPhasesService', 'getProjectTableViewsService', 'getAreasService', 'getSubstancesService', 'saveProjectTableViewService', 'deleteProjectTableViewService', 'saveProjectService', 'getProjectStatusService', 'getProjectsXlsxExportUrlService', 'checkClaimsService', 'getCurrentUserService', 'getTagsService', 'getProjectTypesService'],

	data() {
		return {
			projects: [],
			statuses,
			projectsTotalCount: 0,
			columns: columns.slice(),
			views: [],
			users: [],
			newDefaultView: null,
			currentView: null,
			itemsPerPage: 10,
			page: 1,
			isLoading: true,
			isLoadingProjects: false,
			isRestored: false,
			currentUser: null,
			isViewLoading: false,
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
		let viewColumns = extractViewColumns(this.columns);
		let view = new View();
		view.itemsPerPage = this.itemsPerPage;
		view.name = "Last View";
		view.columns = viewColumns;
		view.isDefault = false;
		sessionStorage.removeItem('queryStringCache');
		
		let result = JSON.stringify(view)
		sessionStorage.setItem('projectSave', result);
		console.info('DESTROYED');
	},

	created: async function () {
		let promises = [];
		// areas
		promises.push(this.getAreasService.getAsync().then((v) => applyValueSet(this.columns, 'area', v)));

		// business units
		promises.push(this.getBusinessUnitsService.getAsync().then((v) => applyValueSet(this.columns, 'businessUnit', v, 'abbreviation')));

		// legal entities
		promises.push(this.getLegalEntitiesService.getAsync().then((v) => applyValueSet(this.columns, 'legalEntity', v, i=> i.sapL4PId  + ' - ' + i.name )));
		promises.push(this.getLegalEntitiesService.getAsync().then((v) => applyValueSet(this.columns, 'legalEntityId', v, i=> i.id)));
		promises.push(this.getLegalEntitiesService.getAsync().then((v) => applyValueSet(this.columns, 'representative', v, i=> i.sapL4PId  + ' - ' + i.name )));
		promises.push(this.getLegalEntitiesService.getAsync().then((v) => applyValueSet(this.columns, 'representativeId', v, i=> i.id)));

		// substances
		promises.push(this.getSubstancesService.getAsync().then((v) => applyValueSet(this.columns, 'substance', v)));
		// substanceIds
		promises.push(this.getSubstancesService.getAsync().then((v) => applyValueSet(this.columns, 'substanceId', v, i=> i.id)));
	

		// legislations
		promises.push(this.getLegislationsService.getAsync().then((v) => applyValueSet(this.columns, 'legislation', v)));

		// cefic codes
		promises.push(this.getCeficCodesService.getAsync().then((v) => applyValueSet(this.columns, 'ceficCode', v)));

		// project types
		promises.push(this.getProjectTypesService.getAsync().then((v) => applyValueSet(this.columns, 'type', v)));

		// status
		promises.push(this.getProjectStatusService.getAsync().then((v) => applyValueSet(this.columns, 'status', v)));

		// tags
		promises.push(
			this.getTagsService.getAsync().then((v) => {
				const column = this.columns.find((i) => i.id == 'tags');
				if (!column) return;

				if (!isObject(column.meta)) this.$set(column, 'meta', {});

				column.meta.existingTags = v;
			})
		);

		// legislation status
		promises.push(
			this.getLegislationStatusService.getAsync().then((v) => {
				const column = this.columns.find((i) => i.id == 'targetLegislationStatus');
				if (!column) return;

				if (!isObject(column.meta)) this.$set(column, 'meta', {});
				console.log(v);
				column.meta.allLegislationStatus = v;
			})
		);

		// substance GPM4
		promises.push(
			this.getSubstancesService.getAsync().then((v) => {
				let result = false;
				// if(project?.businessUnit?.abbreviation == 'SGO')
				// {
				// 	result = project?.substance?.gpM4;
				// }

				applyValueSet(this.columns, 'gPM4', v, i=> i.gPM4);
			})
		);
		

		// manager
		promises.push(
			this.getUsersService.getAsync().then((users) => {
				this.users = users;
				applyValueSet(this.columns, 'manager', users);
				applyValueSet(this.columns, 'localManager', users);
				applyValueSet(this.columns, 'expertUser', users);
				applyValueSet(this.columns, 'businessUnitContact', users);
			})
		);

		// phases
		promises.push(
			this.getPhasesService.getAsync().then((phases) => {
				let sortedPhases = phases.slice();
				sortedPhases.sort((a, b) => {
					if (a.order == b.order) return 0;

					return a.order < b.order ? -1 : 1;
				});

				for (const phase of sortedPhases) {
					this.columns.push(
						Column.create({
							id: `phase-${phase.order}`,
							field: 'phases',
							isVisible: false,
							isSortable: false,
							isSearchable: false,
							label: `Phase: ${phase.name}`,
							component: 'projects-list-phase-cell',
							meta: {
								phase: phase,
							},
						})
					);
				}
			})
		);

		// identifier columns
		promises.push(
			this.getDistinctIdentifierKeysService.getAsync().then((keys) => {
				for (const key of keys) {
					this.columns.push(
						Column.create({
							id: `identifier-${key}`,
							field: 'substance.identifiers',
							isVisible: false,
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
								identifierKey: key,
							},
							sortCallback: (order) => {
								return `orderByIdentifier=${key},${order}`;
							},
						})
					);
				}
			})
		);

		// get current user
		promises.push(
			this.getCurrentUserService.getAsync().then((user) => {
				this.currentUser = user;
				let ddd = this.columns;
				var permissons = user.aggregatedClaims.filter((x)=>x.type == 'Permission' );
				if (permissons.length == 1 && permissons[0].value == 'BusinessUnit') {
					this.columns.splice(0,1);
				}
			})
		);


		await Promise.all(promises);
		
		await this.loadViewsAsync();
		await this.onRefreshDataAsync();
		
		this.isLoading = false;
	},

	computed: {
		canAdminProjects() {
			if (!this.currentUser || !isArray(this.currentUser.claims)) return false;

			return this.checkClaimsService.hasPermission(this.currentUser, Permission.AdminProject);
		},

		canAddProject() {
			if (!this.currentUser || !isArray(this.currentUser.claims)) return false;

			return this.checkClaimsService.canManageAnyArea(this.currentUser);
		},

		xlsxExportUrl() {
			if (!this.columns) return '';

			let resColumns = [];
			for (const column of this.columns) {
				if (column.isVisible) resColumns.push(column.id);
			}
			return this.getProjectsXlsxExportUrlService.get(this.projectsQueryString(), resColumns);
		},

		visibleColumns() {
			return this.columns.filter((e) => e.isActive);
		},

		user() {
			return this.$store.state.user.user;
		},
	},

	methods: {
		async onRefreshDataAsync() {
			this.isLoadingProjects = true;
			try {
				let queryString = this.projectsQueryString();
				const responseData = await this.getProjectsService.getAsync(queryString);

				console.log('response', responseData);
				this.projects = responseData.items;
				this.projectsTotalCount = responseData.totalCount;
			} catch (e) {
				console.error('Error occured during loading of projects', e);
			} finally {
				this.isLoadingProjects = false;
			}
		},
		projectsQueryString: function() {
			let queryString = createOdataQuery(this.itemsPerPage, this.page);

			let queries = columnsToOdataQuery(this.columns, {
				search: searchToOdataQuery,
				valueSet: [valueSetToOdataQuery, 'Guid'],
				dateRange: dateRangeToOdataQuery,
				tags: tagsToOdataQuery,
				legislationStatus: legislationStatusOdataQuery,
			});

			if (queries && queries.filter && queries.filter.length > 0) queryString += '&$filter=' + queries.filter;

			if (queries && queries.sort && queries.sort.length > 0) queryString += '&$orderby=' + queries.sort;

			if (queries && queries.additional && queries.additional.length > 0) queryString += '&' + queries.additional;

			return queryString;
		},
		getSaveStateConfig() {
			return {
				cacheKey: 'component.projects-list.state',
				ignoreProperties: ['isRestored', 'isLoading'],
			};
		},

		setStatuses() {
			const column = find(this.columns, (e) => e.field === 'status');

			if (!column) return;

			column.valueSet = this.statuses;
		},

	
		async loadViewsAsync() {
			const views = await this.getProjectTableViewsService.getAsync();
			this.views = views;
			let storageValue = sessionStorage.getItem('projectSave');
			if (storageValue) {
				this.views.push(JSON.parse(storageValue));
			}
		},

		openProjectWithId(id) {
			this.$router.push(`/projects/${id}`);
		},

		isColumnExist(targetColumn) {
			return find(this.columns, (e) => e == targetColumn);
		},

		/**
		 * @param {import('lanxess-frontend/vuejs/components/async-data-table/Column').Column} column
		 * @param {Boolean} visibility
		 */
		onColumnVisiblityChanged(column, visibility) {
			if (!isColumnExist(column)) return;
				
			targetColumn.isVisible = visibility;
		},

		/**
		 * @param {import('lanxess-frontend/vuejs/components/async-data-table/Column').Column} column
		 * @param {String} searchTerm
		 */
		onColumnSearch(column, searchTerm) {
			if (!isColumnExist(column)) return;

			targetColumn.search = searchTerm;
			this.projectsQuery.searchFilters.push(new DataQuerySearchFilter(column.field, searchTerm));
		},

		async onSaveViewAsync(view) {
			sessionStorage.removeItem("viewSave");
			console.trace('saving view', view);
			view.type = 'Custom';
			await this.saveProjectTableViewService.saveAsync(view);
			await this.loadViewsAsync();
			this.currentView = view;
			this.newDefaultView = find(this.views, (e) => e.id === view.id) || {};
		},

		async onDeleteViewAsync(view) {
			

			if (size(this.views) === 1) return;

			await this.deleteProjectTableViewService.deleteAsync(view);
			sessionStorage.removeItem("viewSave");
			await this.loadViewsAsync();
		},

		async onSaveDataAsync(projects) {
			let promises = [];
			for (const project of projects) {
				promises.push(this.saveProjectService.saveAsync(project));
			}

			await Promise.all(promises);
		},

		getDefaultView(views) {
			return find(views, (view) => view.isDefault) || this.views[0];
		},
	},
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
