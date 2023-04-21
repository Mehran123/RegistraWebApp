<template>
	<div :class="{ 'is-flex': mode == 'summary' }">
		
		<!-- INLINE -->
		<div style="display: inline-block" v-if="mode == 'inline'">
			<b-dropdown   style="z-index: 1000">
				<template #trigger>
					<button class="button has-text-nowrap">
						<span>{{ filterDisplayValue || "by legislation status" }}</span>
						<font-awesome-icon :icon="['fas', 'chevron-down']" class="ml-2"></font-awesome-icon>
					</button>
				</template>
				<b-dropdown-item>
					<label class="label" :class="{ 'is-small': mode == 'small' }">by legislation status</label>
					<div >
					<ul v-for="(group, groupName) in processedAvailableLegislationStatus">
						<li class="is-uppercase is-underlined has-text-weight-bold"><shorten :value="groupName" :max-length="20"></shorten></li>
						<li v-for="(item, j) in group" :key="j">
							<label class="checkbox">
								<input type="checkbox" :checked="isFilterActive(item.id)" @click="toggleFilter(item.id)" />
								{{ item.name }} ({{ item.legislation.name }})
							</label>
							<ul v-for="tonnageValue in item.tonnageValueSet" v-if="item.tonnageValueSet && item.tonnageValueSet.length > 0" class="ml-4">
								<li>
									<input type="checkbox" :checked="isFilterActive(item.id, tonnageValue.name)" @click="toggleFilter(item.id, tonnageValue.name)" />
									{{ tonnageValue.name }}
								</li>
							</ul>
						</li>
					</ul>
					</div>
				</b-dropdown-item>
			</b-dropdown>
			<button class="button" @click="reset()">
				<font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>
			</button>
		</div>

		<!-- INLINE -->
		<!-- <div style="display: inline-block" v-if="mode == 'inline'">
			<b-dropdown   style="z-index: 1000">
				<template #trigger>
					<button class="button has-text-nowrap">
						<span>{{ filterDisplayValue || "by tag" }}</span>
						<font-awesome-icon :icon="['fas', 'chevron-down']" class="ml-2"></font-awesome-icon>
					</button>
				</template>
				<b-dropdown-item>
				<div style="max-height: 200px; overflow: auto;">
					<ul :class="{ small: mode == 'small' }">
						<li v-for="(item, j) in processedTags" :key="j">
							<label class="checkbox">
								<input type="checkbox" :checked="isFilterActive(item)" @click="toggleFilter(item)" />
								{{ item }}
							</label>
						</li>
					</ul>
				</div>
				</b-dropdown-item>
			</b-dropdown>
			<button class="button" @click="reset()">
				<font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>
			</button>
		</div> -->
		
		<!-- SMALL -->
		<div v-if="mode == 'small'">
			<label class="label" :class="{ 'is-small': mode == 'small' }">by legislation status</label>
			<div style="max-height: 200px; overflow: auto;">
			<ul v-for="(group, groupName) in processedAvailableLegislationStatus">
				<li class="is-uppercase is-underlined has-text-weight-bold"><shorten :value="groupName" :max-length="20"></shorten></li>
				<li v-for="(item, j) in group" :key="j">
					<label class="checkbox">
						<input type="checkbox" :checked="isFilterActive(item.id)" @click="toggleFilter(item.id)" />
						{{ item.name }} ({{ item.legislation.name }})
					</label>
					<ul v-for="tonnageValue in item.tonnageValueSet" v-if="item.tonnageValueSet && item.tonnageValueSet.length > 0" class="ml-4">
						<li>
							<input type="checkbox" :checked="isFilterActive(item.id, tonnageValue.name)" @click="toggleFilter(item.id, tonnageValue.name)" />
							{{ tonnageValue.name }}
						</li>
					</ul>
				</li>
			</ul>
			</div>
		</div>

		<!-- SUMMARY -->
		<!-- <div class="is-flex" v-else-if="mode == 'summary'">
			<span class="tags is-flex">
				<span class="tag" v-for="value in filterDisplayValues">
					{{ value }}
				</span>
				<a class="tag is-delete" @click="reset"></a>
			</span>
		</div> -->
	</div>
</template>

<script>
import { isObject, isArray, sortBy, get, isNil, groupBy, some, find, filter, first, defaultTo } from 'lodash'
export const SearchComponent = {
	componentName: 'data-table-filter-value-set',

}

class LegislationStatusFilterValue {
	legislationStatusId;
	tonnageNames = [];
}

/**
 * @param {import('../Column').Column} column
 * @param {String} filterData
 */
export function toOdataQuery(column, filterData) {
	let filterPath = column.field;
	if (!filterData || !Array.isArray(filterData) || filterData.length < 1)
		return null;

	filterPath = filterPath.replace(/\./g, '/');

	let filterValueList = filterData.map((value) => `'${value.legislationStatusId}'`).join(',');
	let innerFilterItems = [];
	for (const filterItem of filterData) {
		let innerFilterItem = '';
		innerFilterItem = `t/legislationStatus/id eq ${filterItem.legislationStatusId}`;
		if (isArray(filterItem.tonnageNames) && filterItem.tonnageNames.length > 0) {
			innerFilterItem = '(' + innerFilterItem + ' and (' + filterItem.tonnageNames.map((v) => `t/tonnageName eq '${v}'`).join(' or ') + '))';
		}

		innerFilterItems.push(innerFilterItem);
	}
	// let innerFilter = filterData.map((value) => `(t/legislationStatus/id eq ${value.legislationStatusId})`).join(' or ');
	const innerFilter = innerFilterItems.join(' or ');


	//return `${filterPath} in (${filterValueList})`;
	// return `${filterPath}/any(t: t/legislationStatus/id in [${filterValueList}])`;
	return `${filterPath}/any(t: ${innerFilter})`;
}

export default {
	props: {
		column: {
			type: Object
		},

		filterId: {
			type: String,
			default: 'tags'
		},

		mode: {
			type: String,
			default: 'small'
		}
	},

	data() {
		return {
			searchString: ''
		}
	},

	watch: {
		'column.filterData': function (filterData) {
			const value = this.getFilterData(filterData);
			if (isArray(value) && value.length > 0) {
				this.$emit('filter-activate', this.filterId, this.column, this)
			}
			else {
				this.$emit('filter-deactivate', this.filterId, this.column, this);
			}
		}
	},

	computed: {
		processedAvailableLegislationStatus() {
			console.assert(isObject(this.column), 'no object');
			console.assert(isArray(this.column?.meta?.allLegislationStatus), 'no array');
			if (!isObject(this.column) || !isArray(this.column?.meta?.allLegislationStatus))
				return [];

			let values = sortBy(this.column?.meta?.allLegislationStatus, e => e.name);
			values = groupBy(values, v => v.legislation.area.name);
			return values;
		},

		isActive() {
			return this.column.filterData && (typeof this.column.filterData === 'object') && this.column.filterData[this.filterId] && Array.isArray(this.column.filterData[this.filterId]) && this.column.filterData[this.filterId].length > 0;
		},

		// filterDisplayValues() {
		// 	let displayValues = [];

		// 	if (!isObject(this.column.filterData)
		// 		|| !isArray(this.column.filterData[this.filterId])
		// 		|| !isArray(this.column.valueSet))
		// 		return displayValues;

		// 	return this.column.filterData[this.filterId];
		// },

		// filterDisplayValue() {
		// 	const values = this.filterDisplayValues ?? [];
		// 	return values.join(', ', );
		// },

	},

	methods: {
		/**
		 * @param any value
		 */
		isFilterActive(legislationStatusId, tonnageName = null) {
			if(this.column.filterData == null)
				return false;
			if (!this.column.filterData && (typeof this.column?.filterData === 'object') && this.column?.filterData[this.filterId] && Array.isArray(this.column?.filterData[this.filterId]))
				return false;
			
			if (!tonnageName)
				return some(this.column.filterData[this.filterId], d => d.legislationStatusId == legislationStatusId);

			 return some(this.column.filterData[this.filterId], d => d.legislationStatusId == legislationStatusId && isArray(d.tonnageNames) && d.tonnageNames.indexOf(tonnageName) >= 0);
		},

		/**
		 * @param {string} legislationStatusId
		 * @param {string} tonnageName
		 * @returns {LegislationStatusFilterValue[]}
		 */
		getFilterValues(legislationStatusId, tonnageName = null) {
			if (!this.column.filterData && (typeof this.column.filterData === 'object') && this.column.filterData[this.filterId] && Array.isArray(this.column.filterData[this.filterId]))
				return null;
			
			if (! tonnageName)
				return filter(this.column.filterData[this.filterId], d => d.legislationStatusId == legislationStatusId);

			const filterValue = find(this.column.filterData[this.filterId], d => d.legislationStatusId == legislationStatusId && isArray(d.tonnageNames) && d.tonnageNames.indexOf(tonnageName) >= 0);
			if (!filterValue)
				return [];
			
			return [filterValue];
		},

		toggleFilter(legislationStatusId, tonnageName = null) {

			if (!this.column.filterData)
				this.$set(this.column, 'filterData', {});

			if (!Array.isArray(this.column.filterData[this.filterId]))
				this.$set(this.column.filterData, this.filterId, []);

			if (this.isFilterActive(legislationStatusId, tonnageName)) {
				const existingFilterValues = this.getFilterValues(legislationStatusId, tonnageName);
				// if (isArray(existingFilterValues))
					existingFilterValues.forEach(element => {
						const index = this.column.filterData[this.filterId].indexOf(element);
						this.column.filterData[this.filterId].splice(index, 1);
					});
				// else {
				// 	const index = this.column.filterData[this.filterId].indexOf(existingFilterValues);
				// 	this.column.filterData[this.filterId].splice(index, 1);
				// }
			}
			else {
				let filterValue = first(this.getFilterValues(legislationStatusId));
				if (filterValue == null) {
					filterValue = new LegislationStatusFilterValue();
					this.column.filterData[this.filterId].push(filterValue);
				}
				
				console.log("filterValue", filterValue);

				filterValue.legislationStatusId = legislationStatusId;
				filterValue.tonnageNames = defaultTo(filterValue.tonnageNames, []);
				if (tonnageName)
					filterValue.tonnageNames.push(tonnageName);
				
				console.log("column filter data", this.column.filterData[this.filterId]);
			}

			if (this.isActive)
				this.$emit('filter-activate', this.filterId, this.column, this);
			else
				this.$emit('filter-deactivate', this.filterId, this.column, this);

			this.$emit('input', this.column.filterData[this.filterId]);
			this.$emit('filter-change', this.filterId, this.isActive, this.column, this);
		},

		reset() {
			this.$set(this.column.filterData, this.filterId, []);

			this.$emit('filter-deactivate', this.filterId, this.column, this);
			this.$emit('input', this.column.filterData[this.filterId]);
			this.$emit('filter-change', this.filterId, this.isActive, this.column, this);
		},

		getFilterData(filterData) {
			if (!isObject(filterData))
				return null;

			if (this.filterId in filterData)
				return filterData[this.filterId];

			return null;
		}
	},

	created() {
		if (this.column && this.column.filterData) {
			const value = this.getFilterData(this.column.filterData);
			if (isArray(value) && value.length > 0) {
				this.$emit('filter-activate', this.filterId, this.column, this)
			}
			else {
				this.$emit('filter-deactivate', this.filterId, this.column, this);
			}
		}
	}
}
</script>

<style scoped>
ul.small {
	max-height: 200px;
	overflow: auto;
}
</style>