<template>
	<editable-base :is-edit="isEdit" :display-value="displayValue">
		<b-select v-model="selectedLegislationId" expanded @input="onInput" :disabled="!filteredValueSet.length" v-show="filteredValueSet && filteredValueSet.length > 0">
			<option v-for="item in filteredValueSet" :value="item.value.id">{{ item.label }}</option>
		</b-select>
		<div v-show="!filteredValueSet || filteredValueSet.length == 0" class="has-text-info">
			No legislations defined for selected area
		</div>
	</editable-base>
</template>

<script>
	import { get, orderBy } from 'lodash';
	import EditableBaseComponent from 'lanxess-frontend/vuejs/components/EditableBase.vue';

	export default {
		components: {
			'editable-base': EditableBaseComponent
		},

		props: {
			value: {
				type: Object,
				default: () => {}
			},

			referenceValue: {
				default: undefined
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
			},

			name: {
				type: String,
				default: 'legislation'
			},

			rules: {
				type: [Object, String],
				default: ''
			}
		},

		data() {
			return {
				selectedLegislationId: get(this.value, 'id', '')
			};
		},

		watch: {
			value(newValue) {
				if (newValue === null) {
					this.selectedLegislationId = '';
					return;
				}

				if (newValue && newValue.id) this.selectedLegislationId = newValue.id;
			},

			'item.area': {
				handler(newValue, oldValue) {
					if (!newValue || !oldValue) {
						this.emitInputEvent(null);
						return;
					}

					if (newValue.id === oldValue.id || this.value == null) return;

					if (newValue.id !== get(this.value, 'area.id')) this.emitInputEvent(null, null);
				}
			}
		},

		computed: {
			displayValue() {
				return get(this, 'value.name', '');
			},

			filteredValueSet() {
				return orderBy(
					this.valueSet.filter(e => get(e, 'value.areaId') === get(this.item, 'area.id')),
					e => e.label
				);
			}
		},

		methods: {
			onInput(selectedValueId) {
				const selectedValueSetItem = this.valueSet.find(e => e.value.id === selectedValueId);
				if (!selectedValueSetItem) return;

				this.emitInputEvent(selectedValueSetItem.value, selectedValueSetItem.referenceValue);
			},

			emitInputEvent(value, referenceValue) {
				console.log(value, referenceValue);
				this.$emit('input', value, this.item, this.referenceId);
				this.$emit('update:referenceValue', referenceValue);
				console.log(this.item);
			}
		}
	};
</script>

<style></style>
