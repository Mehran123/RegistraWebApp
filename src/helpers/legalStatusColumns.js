import { Column, View, ViewColumn, ColumnBaseType, DataType } from 'lanxess-frontend/vuejs/components/async-data-table/Column';

export const defaultView = new View(null, 'Default View');
defaultView.isDefault = true;
defaultView.itemsPerPage = 10;
defaultView.isEditable = false;
defaultView.type = 'System';
defaultView.columns.push(new ViewColumn('#actions'));
defaultView.columns.push(new ViewColumn('no', 'desc'));
defaultView.columns.push(new ViewColumn('name'));
defaultView.columns.push(new ViewColumn('legislation'));
defaultView.columns.push(new ViewColumn('area'));

export const defaultPhasesView = new View(null, 'Phases');
defaultPhasesView.isDefault = false;
defaultPhasesView.itemsPerPage = 10;
defaultPhasesView.isEditable = false;
defaultPhasesView.type = 'System';
defaultPhasesView.columns.push(new ViewColumn('#actions'));
defaultPhasesView.columns.push(new ViewColumn('no', 'desc'));
defaultPhasesView.columns.push(new ViewColumn('name'));
defaultPhasesView.columns.push(new ViewColumn('area'));
defaultPhasesView.columns.push(new ViewColumn('phase-1'));
defaultPhasesView.columns.push(new ViewColumn('phase-2'));
defaultPhasesView.columns.push(new ViewColumn('phase-3'));
defaultPhasesView.columns.push(new ViewColumn('phase-4'));
defaultPhasesView.columns.push(new ViewColumn('phase-5'));
defaultPhasesView.columns.push(new ViewColumn('phase-6'));

const defaultSearchFilter = {
	component: 'async-data-table-filter-search',
	id: 'search'
};
const defaultValueSetFilter = {
	component: 'async-data-table-filter-value-set',
	id: 'valueSet'
};

export let Columns = [
	Column.create({
		id: '#actions',
		isVisible: true,
		sticky: true,
		label: 'Actions',
		component: 'projects-list-actions-cell',
		width: '120px',
		isSortable: false
	}),
	// new Column('no', true, 'No', ColumnBaseType.Number, true, [defaultSearchFilter]),
	// new Column('name', true, 'Name', ColumnBaseType.String, true, [defaultSearchFilter]),

	Column.create({
		id: 'legislationStatus',
		field: 'legislationStatus',
		label: 'Legislation Status',
		isEditable: false,
		baseType: ColumnBaseType.Array,
		displayPath: 'name',
		idValuePath: 'id',
		isSortable: false,
		idValueDataType: DataType.Guid
	}),

	Column.create({
		id: 'legalEntity',
		field: 'project',
		label: 'Legal Entity',
		isEditable: false,
		baseType: ColumnBaseType.Array,
		displayPath: 'legalEntity.name',
		idValuePath: 'legalEntity.id',
		isSortable: false,
		idValueDataType: DataType.Guid
	}),

	Column.create({
		id: 'substance',
		field: 'project',
		label: 'Substance',
		baseType: ColumnBaseType.SelectObject,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'substance.name',
		idValuePath: 'substance.id',
		idValueDataType: DataType.Guid
	}),

	// Column.create({
	// 	field: 'manager',
	// 	label: 'Manager',
	// 	component: 'people-selector-cell',
	// 	idValuePath: 'id',
	// 	idValueDataType: DataType.String,
	// 	displayPath: 'name',
	// 	filters: [defaultSearchFilter, defaultValueSetFilter],
	// 	isSortable: true
	// }),

	// Column.create({
	// 	field: 'localManager',
	// 	label: 'Local Manager',
	// 	component: 'people-selector-cell',
	// 	idValuePath: 'id',
	// 	idValueDataType: DataType.String,
	// 	displayPath: 'name',
	// 	filters: [defaultSearchFilter, defaultValueSetFilter],
	// 	isSortable: true
	// }),

	// Column.create({
	// 	field: 'businessUnitContact',
	// 	label: 'Business Unit Contact',
	// 	component: 'people-selector-cell',
	// 	idValuePath: 'id',
	// 	idValueDataType: DataType.String,
	// 	displayPath: 'name',
	// 	filters: [defaultSearchFilter, defaultValueSetFilter],
	// 	isSortable: true
	// }),

	// Column.create({
	// 	field: 'businessUnit',
	// 	label: 'Business Unit',
	// 	baseType: ColumnBaseType.SelectObject,
	// 	filters: [
	// 		{ component: 'async-data-table-filter-search', id: 'search' },
	// 		{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
	// 	],
	// 	displayPath: 'name',
	// 	idValuePath: 'id',
	// 	idValueDataType: DataType.Guid
	// }),

	// new Column('businessLine', true, 'Business Line', ColumnBaseType.String, true, []),

	Column.create({
		id: 'area',
		field: 'legislationStatus',
		label: 'Area',
		isEditable: false,
		baseType: ColumnBaseType.SelectObject,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'legislation.area.name',
		idValuePath: 'legislation.area.id',
		idValueDataType: DataType.Guid
	}),

	Column.create({
		id: 'legislation',
		field: 'legislationStatus',
		label: 'Legislation',
		isEditable: false,
		baseType: ColumnBaseType.SelectObject,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'legislation.name',
		idValuePath: 'legislation.id',
		idValueDataType: DataType.Guid
	}),

	// new Column('typeId', false, 'Type ID'),

	Column.create({
		field: 'legalEntity',
		label: 'Legal Entity',
		baseType: ColumnBaseType.SelectObject,
		filters: [
			{ component: 'async-data-table-filter-search', id: 'search' },
			{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
		],
		displayPath: 'name',
		idValuePath: 'id',
		idValueDataType: DataType.Guid
	})

	// Column.create({
	// 	field: 'status',
	// 	label: 'Status',
	// 	baseType: ColumnBaseType.SelectPlainString
	// }),

	// Column.create({
	// 	id: 'deadline',
	// 	field: 'deadline',
	// 	label: 'Deadline',
	// 	component: 'date-picker-cell',
	// 	filters: [
	// 		{ component: 'async-data-table-filter-search', id: 'search' },
	// 		{ component: 'async-data-table-filter-value-set', id: 'valueSet' },
	// 		{ component: 'async-data-table-filter-date-range', id: 'dateRange' }
	// 	],
	// }),

	// Column.create({
	// 	field: 'localContactId',
	// 	label: 'Local Contact',
	// 	component: 'people-selector-cell',
	// 	idValuePath: 'id',
	// 	idValueDataType: DataType.Guid,
	// 	displayPath: 'name',
	// 	filters: [defaultSearchFilter, defaultValueSetFilter],
	// 	isSortable: true
	// }),

	// Column.create({
	// 	id: 'registrationValidUntil',
	// 	field: 'registrationValidUntil',
	// 	label: 'Registration Valid Until',
	// 	component: 'date-picker-cell'
	// }),

	// Column.create({
	// 	id: 'isConsortium',
	// 	field: 'isConsortium',
	// 	label: 'Consortium',
	// 	component: 'state-cell',
	// 	width: '80px'
	// }),

	// Column.create({
	// 	field: 'isLocked',
	// 	label: 'Locked',
	// 	component: 'state-cell',
	// 	width: '80px'
	// }),

	// Column.create({
	// 	field: 'isUpdate',
	// 	label: 'Update',
	// 	component: 'state-cell',
	// 	width: '80px'
	// }),

	// Column.create({
	// 	field: 'ceficCode',
	// 	label: 'Cefic Code',
	// 	baseType: ColumnBaseType.SelectObject,
	// 	filters: [
	// 		{ component: 'async-data-table-filter-search', id: 'search' },
	// 		{ component: 'async-data-table-filter-value-set', id: 'valueSet' }
	// 	],
	// 	displayPath: 'name',
	// 	idValuePath: 'id',
	// 	idValueDataType: DataType.Guid
	// })

	// Column.create({
	// 	id: 'isLabelingRequired',
	// 	field: 'isLabelingRequired',
	// 	label: 'Labeling Required',
	// 	component: 'state-cell',
	// 	width: '80px'
	// }),
	// new Column('isLabelingRequired', false),
	//new Column('isEsdsRequired', false),
	// new Column('isNano', false),
	// new Column('hasRoleImporter', false),
	// new Column('hasRoleManufacturer', false),
	// new Column('hasRoleOwnUse', false),
	// new Column('hasRoleOnlyRepresentative', false),
	// new Column('tonnage', false),
	// new Column('hasRoleDossierDistribution', false),
	// new Column('isConsortium', false),
	// new Column('isPbt', false),
	// new Column('isReadAcross', false),
	// new Column('isDqChecked', false),
	// new Column('isLocked', false),
	// new Column('isNonPhaseIn', false),
	// new Column('isUpdate', false),
];
