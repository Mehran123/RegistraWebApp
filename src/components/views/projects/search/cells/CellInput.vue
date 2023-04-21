<template>
	<input ref="input" v-model="localValue" class="cell input w-100 lighten-3 px-3 w-auto" type="text" @keypress.enter="closeEdit" @blur="closeEdit" />
</template>

<script>
	import { trim } from 'lodash';

	export default {
		props: {
			value: {
				type: [String, Number, Boolean],
				default: '—'
			}
		},

		data() {
			return {
				localValue: this.value
			};
		},

		mounted() {
			this.$nextTick(() => this.$refs.input.focus());
		},

		methods: {
			closeEdit() {
				this.localValue = trim(this.localValue);
				this.$emit('close-edit', this.localValue);
			}
		}
	};
</script>

<style lang="scss" scoped>
	$cell-width: 210px;

	.cell {
		height: 33px;
	}

	.input {
		position: absolute;
		top: 0;
		left: 0;
		max-width: $cell-width;
		border: 2px solid #1a72e8;
		background-color: #e2e2e2;
		color: black;
		z-index: 3;

		&-wrapper {
			position: relative;
		}
	}
</style>
