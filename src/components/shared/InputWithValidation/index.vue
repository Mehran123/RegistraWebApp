<template>
	<div class="input-with-validation">
		<validation-provider v-if="isEdit" :mode="mode" :vid="vid || name" :name="name" :rules="rules" v-slot="{ errors, valid }">
			<b-field v-bind="$attrs" :type="{ 'is-danger': errors[0] }" :message="errors">
				<slot v-if="$scopedSlots.default" :value="localValue" :attrs="$attrs" @input="onInput"></slot>
				<b-autocomplete v-else-if="isAutocomplete" v-model="localValue" v-bind="$attrs" :placeholder="placeholder" :field="field" :data="data" expanded @select="$emit('select', $event)" />
				<b-select v-else-if="isSelect" v-model="localValue" v-bind="$attrs" expanded>
					<slot v-if="$scopedSlots.option" name="option" :data="data" />
					<option v-else v-for="option in data" :value="option" :key="option.id">
						{{ option.name }}
					</option>
				</b-select>
				<app-select-multiple v-else-if="isMultiple" v-model="localValue" v-bind="$attrs" :class="{ hasErrors: errors[0] }" :data="data" />
				<b-input v-else v-model="localValue" v-bind="$attrs" :placeholder="placeholder"></b-input>
			</b-field>
		</validation-provider>

		<div v-else>
			<div class="field">
				<div class="label">{{ $attrs.label }}</div>
				<div>{{ valueLabel }}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { ValidationProvider, extend } from 'vee-validate';
	import initValidation from './custom-validations.js';

	initValidation(extend);

	export default {
		components: {
			ValidationProvider
		},

		props: {
			mode: {
				type: String,
				default: 'aggressive'
			},

			isEdit: {
				type: Boolean,
				default: true
			},

			vid: {
				type: String
			},

			inputType: {
				type: String,
				default: 'input'
			},

			data: {
				type: Array,
				default: () => []
			},

			field: {
				type: String,
				default: 'key'
			},

			rules: {
				type: [Object, String],
				default: ''
			},

			name: {
				type: String,
				required: true
			},

			value: {
				type: null,
				required: true
			},

			placeholder: {
				type: String,
				default: ''
			},

			displayValue: {
				type: String,
				default: ''
			}
		},

		data() {
			return {
				localValue: ''
			};
		},

		watch: {
			localValue(newVal) {
				this.$emit('input', newVal);
			},

			value: {
				handler(newVal) {
					if (newVal) {
						this.localValue = newVal;
					}
				},

				immediate: true
			}
		},

		computed: {
			valueLabel() {
				if (this.isSelect || this.isAutocomplete) {
					return this.displayValue || this.localValue.name || this.localValue || '—';
				}

				return this.displayValue || this.localValue || '—';
			},

			isAutocomplete() {
				return this.inputType === 'autocomplete';
			},

			isSelect() {
				return this.inputType === 'select';
			},

			isMultiple() {
				return this.inputType === 'multiple';
			}
		},

		methods: {
			onInput(input) {
				this.localValue = input;
			}
		}
	};
</script>

<style lang="scss">
	.input-with-validation {
		width: 100%;

		.hasErrors {
			border-color: #ff3860;
		}

		.field {
			margin-bottom: 0.75rem;
		}
	}
</style>
