<template>
	<div>
		<div v-if="isEdit && canEdit">
		
			<div class="columns is-vcentered" v-for="item in filteredValueSet">
				<!-- legislation status -->
				<div class="column is-one-fourth" style="white-space: nowrap">
					<b-checkbox :value="isValueSetItemSelected(item)" @input="onActivateLegislationStatus(item)">
						{{ item.label }}
					</b-checkbox>
				</div>
				<!-- tonnage options -->
				<div class="column is-one-fourth" v-if="isValueSetItemActive(item) && hasTonnageOptions(item)">
					<b-select @input="onSelectLegislationStatusTonnage(item, $event)" :value="getTonnageIdValue(item)">
						<option :value="tonnageItem.id" v-for="tonnageItem in item.value.tonnageValueSet" :selected="tonnageItem.name == getLegislationInstanceForValueSetItem(item).tonnageName">{{tonnageItem.name}}</option>
					</b-select>
				</div>
				<!-- custom tonnage -->
				<div class="column is-one-fourth" v-if="isValueSetItemActive(item) && hasCustomTonnageOption(item)">
					<div class="field has-addons">
						<div class="control">
							<input type="number" step="1" class="input" :value="getCustomizedTonnageValue(item)" @input="onCustomizeTonnage(item, $event)" />
						</div>
						<div class="control">
							<a class="button is-static">
								t
							</a>
						</div>
					</div>
				</div>
				<!-- flags -->
				<div class="column is-one-fourth" v-if="isValueSetItemActive(item) && hasFlagOptions(item)">
					<b-checkbox :value="isFlagActive(flagItem, item)" @input="onToggleFlag(flagItem, item)" v-for="flagItem in item.value.flagValueSet">
						{{ flagItem.name }}
					</b-checkbox>
					
				</div>
			</div>
			<div v-show="!filteredValueSet || filteredValueSet.length == 0" class="has-text-info">
				No legislation scope available for selected area-legislations combination
			</div>
		</div>
		<div v-if="!isEdit || !canEdit">
			<ul style="list-style-type: disc" class="ml-4" v-if="orderedValues && orderedValues.length > 1">
				<li v-for="item in orderedValues">
					{{ item.legislationStatus.name }}{{tonnageDisplayValue(item)}}
					<span class="tag" v-for="flag in item.flags">{{ flag }}</span>
				</li>
			</ul>
			<span v-if="orderedValues && orderedValues.length == 1">
				{{ orderedValues[0].legislationStatus.name }}{{ tonnageDisplayValue(orderedValues[0]) }}
				<span class="tag" v-for="flag in orderedValues[0].flags">{{ flag }}</span>
			</span>

		</div>
	</div>
</template>

<script>
import { v4 as uuid } from 'uuid';
import { get, sortBy, isNil, trim, find, isEmpty, toNumber } from 'lodash';
import { LegislationStatusInstance } from '../../models/LegislationStatusInstance'

export default {
	props: {
		value: {
			type: Array,
			default: () => []
		},
		item: {
			type: Object
		},
		isEdit: {
			type: Boolean,
			default: false
		},
		valueSet: {
			type: Array,
			default: () => []
		},
		referenceId: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			values: []
		};
	},

	watch: {
		// value: {
		// 	handler(newValue) {
		// 		this.values = !newValue ? [] : newValue;
		// 	}
		// },

		'item.legislation': {
			handler(newValue, oldValue) {
				// consider breaking if oldValue is null
				if (newValue == oldValue) return;

				if (!Array.isArray(this.value) || this.value.length < 1) return;

				if (newValue === null) {
					this.emitInputEvent([]);
					return;
				}

				const newValues = this.value.filter(e => e.legislationStatus.legislation.id === newValue.id);
				this.emitInputEvent(newValues);
			},
			immediate: true,
			deep: true
		}
	},

	computed: {
		displayValue() {
			return 'unknown';
		},

		orderedValues() {
			if (!Array.isArray(this.value))
				return [];

			return sortBy(this.value, e => e.legislationStatus.name);
		},

        canEdit(){
			// return this.item?.substance?.legislationStatus[0]?.status?.name != 'Manufacture ceased' && this.item?.substance?.legislationStatus[0]?.status?.name != 'Expired' 
			return true;
		},

		filteredValueSet() {
			if (!this.item.legislation || !this.item.legislation.id) return [];
//
			return sortBy(
				this.valueSet.filter(e => e.value.legislation.id === this.item.legislation.id),
				e => e.label
			);
		},


	},

	methods: {
		isValueSetItemActive(valueSetItem) {
			return !isNil(this.getLegislationInstanceForValueSetItem(valueSetItem));
		},

		hasTonnageOptions(valueSetItem) {
			return (!isNil(valueSetItem) && valueSetItem?.value?.tonnageValueSet?.length > 0);
		},

		hasCustomTonnageOption(valueSetItem) {
			return (!isNil(valueSetItem) && valueSetItem?.value?.canCustomizeTonnage);
		},

		hasFlagOptions(valueSetItem) {
			return (!isNil(valueSetItem) && valueSetItem?.value?.flagValueSet?.length > 0);
		},

		getLegislationInstanceForValueSetItem(valueSetItem) {
			if (!Array.isArray(this.value) || isNil(valueSetItem))
				return null;

			if (isEmpty(this.value))
				return null;
			return find(this.value, i => i.legislationStatusId == valueSetItem.value.id);
		},

		getTonnageIdValue(valueSetItem) {
			const instance = this.getLegislationInstanceForValueSetItem(valueSetItem);
			var tonnageItem = find(valueSetItem.value.tonnageValueSet, e => e.name == instance.tonnageName);
			if (isNil(tonnageItem))
				return null;

			return tonnageItem.id;
		},

		

		isFlagActive(flagValueSetItem, legislationStatusValueSetItem) {
			var legislationStatusInstance = this.getLegislationInstanceForValueSetItem(legislationStatusValueSetItem);
			if (!legislationStatusInstance || !Array.isArray(legislationStatusInstance.flags) || legislationStatusInstance.flags.length == 0)
				return false;

			return legislationStatusInstance.flags.includes(flagValueSetItem.name);
		},

		isValueSetItemSelected(valueSetItem) {
			return this.value.findIndex(i => i.legislationStatusId == valueSetItem.value.id) > -1;
		},

		tonnageDisplayValue(legislationStatusInstance) {
			if (isNil(legislationStatusInstance == null) || !trim(legislationStatusInstance?.tonnageName))
				return '';

			return ` (${legislationStatusInstance.tonnageName})` ?? '';
		},

		onActivateLegislationStatus(valueSetItem) {
			let values = [];
			if (Array.isArray(this.value))
				values = this.value;

			if (Array.isArray(values) && values.length > 0) {
				const index = values.findIndex(i => i.legislationStatus.id == valueSetItem.value.id);
				if (index > -1)
					values.splice(index, 1);
				else
					values.push(this.createValueFromValueSetItem(valueSetItem));
			}
			else
				values.push(this.createValueFromValueSetItem(valueSetItem));

			this.emitInputEvent(values);
		},

		onSelectLegislationStatusTonnage(valueSetItem, tonnageItemId) {
			const legislationStatusInstance = this.getLegislationInstanceForValueSetItem(valueSetItem);
			if (legislationStatusInstance == null)
				return;

			const tonnageItem = find(valueSetItem?.value?.tonnageValueSet, e => e.id == tonnageItemId);
			if (tonnageItem == null)
				return;

			legislationStatusInstance.tonnageName = tonnageItem.name;
			legislationStatusInstance.tonnage = tonnageItem.value;
			this.emitInputEvent(this.value);
		},

		onCustomizeTonnage(valueSetItem, event) {
			const legislationStatusInstance = this.getLegislationInstanceForValueSetItem(valueSetItem);
			if (legislationStatusInstance == null)
				return;

			const tonnage = toNumber(event.target.value);

			legislationStatusInstance.tonnageName = `${tonnage} t`;
			legislationStatusInstance.tonnage = tonnage;
			this.emitInputEvent(this.value);
		},

		getCustomizedTonnageValue(valueSetItem) {
			const legislationStatusInstance = this.getLegislationInstanceForValueSetItem(valueSetItem);
			if (legislationStatusInstance == null)
				return undefined;

			const tonnage = toNumber(legislationStatusInstance?.tonnage);
			return tonnage;
		},

		onToggleFlag(flagValueSetItem, valueSetItem) {
			const legislationStatusInstance = this.getLegislationInstanceForValueSetItem(valueSetItem);
			if (legislationStatusInstance == null)
				return;

			if (!Array.isArray(legislationStatusInstance.flags))
				legislationStatusInstance.flags = [];

			if (legislationStatusInstance.flags.includes(flagValueSetItem.name)) {
				const index = legislationStatusInstance.flags.indexOf(flagValueSetItem.name);
				legislationStatusInstance.flags.splice(index, 1);
			}
			else {
				legislationStatusInstance.flags.push(flagValueSetItem.name);
			}

			this.emitInputEvent(this.value);
		},

		createValueFromValueSetItem(valueSetItem) {
			const legislationStatus = valueSetItem.value;
			const item = new LegislationStatusInstance(legislationStatus, this.item);
			return item;
		},

		emitInputEvent(values) {
			this.$emit('input', values, this.item, this.referenceId);
		}
	}
};
</script>

<style></style>
