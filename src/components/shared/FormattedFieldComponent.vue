<template>
	<div class="columns is-vcentered">
		<div class="column">
			<label class="label">{{ label }}</label>
		</div>
		<div class="column">
			<slot v-bind="allProps" @input="onInput"></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		isEdit: {
			type: Boolean,
			default: false
		},

		label: {
			type: String,
			default: ''
		}
	},

	computed: {
		allProps() {
			let all = {};
			Object.assign(all, this.$attrs, this.$props);
			return all;
		},

	},

	methods: {
		onInput(value, referenceId) {
			this.$emit('input', value, referenceId);
		}
	}
};
</script>
<style lang="scss"></style>
