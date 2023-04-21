<template>
	<div>
	<b-tabs v-model="currentTab">
		<b-tab-item label="Base Data">
			<base-data v-bind="{ ...$props, ...$attrs }"></base-data>
		</b-tab-item>
		<b-tab-item label="Datagaps">
			<data-gaps v-bind="{ ...$props, ...$attrs }" />
		</b-tab-item>
		<!--		 <b-tab-item label="IUCLID / CSR"></b-tab-item> -->
		<b-tab-item label="Consortium">
			<consortium v-bind="{ ...$props, ...$attrs }" />
		</b-tab-item>
		<!-- <b-tab-item label="Consortium"></b-tab-item> -->
		<!-- <b-tab-item label="Financials"></b-tab-item> -->
		<b-tab-item label="Authority">
			<authority v-bind="{ ...$props, ...$attrs }" />
		</b-tab-item>
		<!-- <b-tab-item label="eSDS"></b-tab-item> -->
		<b-tab-item label="Planning">
			<planning-data v-bind="$props"></planning-data>
		</b-tab-item>
		<!-- <b-tab-item label></b-tab-item> -->
	</b-tabs>
	</div>
</template>

<script>
	import { toInteger } from 'lodash';
	import ProjectBaseDataComponent from './ProjectBaseDataComponent.vue';
	import ProjectDataGapsComponent from './ProjectDataGapsComponent.vue';
	import ProjectConsortiumComponent from './ProjectConsortiumComponent.vue';
	import ProjectPlanningComponent from './ProjectPlanningComponent.vue';
	import ProjectAuthorityComponent from './ProjectAuthorityComponent.vue';

	export default {
		components: {
			'base-data': ProjectBaseDataComponent,
			'data-gaps': ProjectDataGapsComponent,
			consortium: ProjectConsortiumComponent,
			'planning-data': ProjectPlanningComponent,
			authority: ProjectAuthorityComponent,
		},

		props: {
			project: {
				type: Object,
				default: () => ({})
			},

			users: {
				type: Array,
				default: () => []
			},

			showDeveloperInformation: {
				type: Boolean,
				default: false
			},

			isEditMode: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				currentTab: toInteger(this.$route.query.tab) || 0
			};
		},

		watch: {
			currentTab(newValue) {
				this.$router.replace({
					query: { ...this.$route.query, tab: newValue || null }
				});
			}
		}
	};
</script>

<style lang="scss" scoped></style>
