<template>
	<div>
		<font-awesome-icon :icon="['fas', 'circle']" class="has-text-warning" v-if="phaseData.status == 'Overdue'"></font-awesome-icon>
		<font-awesome-icon :icon="['fas', 'circle']" class="has-text-danger" v-if="phaseData.status == 'OverdueDeadline'"></font-awesome-icon>
		<font-awesome-icon :icon="['fas', 'circle']" class="has-text-success" v-if="phaseData.status == 'Ok'"></font-awesome-icon>
		<font-awesome-icon :icon="['fas', 'check']" class="has-text-success" v-if="phaseData.status == 'Done'"></font-awesome-icon>
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
			baseType: {
				type: String,
				default: 'string'
			},
			valuePath: {
				type: String,
				default: null
			},
			displayPath: {
				type: String,
				default: null
			},
			valueSet: {
				type: Array,
				default: () => []
			},
			referenceId: {
				type: String,
				default: ''
			},
			phase: {
				type: Object,
				default: () => {}
			}
		},

		computed: {
			phaseData() {
				return this.value.find(phaseData => phaseData.phaseId == this.phase.id) || {};
			}
		},

		methods: {}
	};
</script>

<style></style>
