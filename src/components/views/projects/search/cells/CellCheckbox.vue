<template>
	<span class="w-100 d-flex justify-center">
		<v-checkbox v-model="localValue" color="blue darken-2" class="cell-checkbox mt-0" hide-details :ripple="false" :disabled="disabled" @change="closeEdit" />
	</span>
</template>

<script>
	export default {
		props: {
			value: {
				type: [String, Boolean],
				default: '—',
				required: true
			},

			disabled: {
				type: Boolean,
				default: false,
				required: true
			}
		},

		data() {
			return {
				localValue: this.value
			};
		},

		watch: {
			value(newValue) {
				this.localValue = newValue;
			}
		},

		methods: {
			closeEdit() {
				this.$emit('close-edit', this.localValue);
			}
		}
	};
</script>

<style lang="scss"></style>
