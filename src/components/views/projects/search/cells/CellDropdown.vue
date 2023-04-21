<template>
	<v-select ref="dropdown" v-model="localValue" class="cell-dropdown" placeholder="—" item-text="value" item-value="key" :items="dictionaries[header.dictionary]" dense solo hide-details return-object @change="closeEdit" @blur="closeEdit" />
</template>

<script>
	import { find } from 'lodash';

	const findFromDict = (dict, key, value) => {
		return find(dict[key], ['value', value]);
	};

	export default {
		props: {
			value: {
				type: [String, Number],
				default: '—'
			},

			header: {
				required: true,
				type: Object,
				default: () => ({})
			},

			dictionaries: {
				required: true,
				type: Object,
				default: () => ({})
			}
		},

		data() {
			return {
				localValue: findFromDict(this.dictionaries, this.header.dictionary, this.value)
			};
		},

		mounted() {
			this.$nextTick(() => this.$refs.dropdown.focus());
		},

		methods: {
			closeEdit() {
				if (this.localValue) {
					this.$emit('close-edit', this.localValue.value);
				} else {
					this.$emit('close-edit', this.value);
				}
			}
		}
	};
</script>

<style lang="scss">
	.cell-dropdown {
		height: 33px;

		.v-input__slot {
			min-height: auto;
			height: 33px;
		}
	}
</style>
