<template>
	<div>
		{{ identifier.value }}
	</div>
</template>

<script>
	import { get } from 'lodash';

	export default {
		props: {
			value: {},
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

			identifierKey: {
				type: String
			}
		},

		computed: {
			identifier() {
				return this.value?.find(identifier => identifier?.key == this.identifierKey) || {};
			}
		},

		methods: {}
	};
</script>

<style></style>
