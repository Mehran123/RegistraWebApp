<template>
	<view-wrapper is-borderless>
		<template #title>#{{project.no}} {{project.name}}</template>
		<template #subtitle>Project Details</template>
		<!-- <template v-if="loading.general" #subtitle>
			<b-progress class="pt-3" size="is-small" type="is-primary"></b-progress>
		</template>
		<template v-else #subtitle>{{ project.name }}</template> -->
		<div class="">
			<project-header :project="project"></project-header>
		</div>
		<template v-if="!isEmptyProject">
			<nav class="navbar is-primary mb-2" role="navigation" aria-label="dropdown navigation" v-if="project.canWrite">
				<div class="navbar-start">
					<a class="navbar-item" @click="isEditMode = true" v-show="!isEditMode">
						<font-awesome-icon :icon="['fas', 'pen']" class="mr-2"></font-awesome-icon>
						Edit
					</a>
					<a class="navbar-item is-warning" :disabled='!isActive'  v-show="isEditMode" @click="saveProjectAsync">
						<font-awesome-icon :icon="['fas', 'save']" class="mr-2"></font-awesome-icon>
						Save
					</a>
					<a class="navbar-item is-primary" v-show="isEditMode" @click="onCancelProjectEdit">
						<font-awesome-icon :icon="['fas', 'ban']" class="mr-2"></font-awesome-icon>
						Cancel
					</a>
					<a class="navbar-item is-primary" v-show="!isEditMode && canFinalizeProject" @click="closeProject">
						<font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2"></font-awesome-icon>
						Finalize Project
					</a>
				</div>

			</nav>

			<div>
				<!-- <project-head :project="project"></project-head> -->
			</div>
			<div style="max-width: 99vw">
				<validation-observer ref="form" v-slot="{ passes }">
					<project-tabs v-bind="$data" :key="isEditMode" :show-developer-information="showDeveloperInformation" :default-no-value-display-value="defaultNoValueDisplayValue"></project-tabs>
				</validation-observer>
			</div>
		</template>
	</view-wrapper>
</template>

<script>
import { cloneDeep, isEmpty, toLower } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import ProjectTabsComponent from './ProjectView/ProjectTabsComponent.vue'
import HeaderComponent from './ProjectView/HeaderComponent.vue'

// import ProjectHeadDataComponent from './ProjectView/ProjectHeadDataComponent.vue'

export default {
	components: {
		ValidationObserver,
		'project-tabs': ProjectTabsComponent,
		'project-header': HeaderComponent

		// 'project-head': ProjectHeadDataComponent
	},

	props: {
		showDeveloperInformation: {

		},

		defaultNoValueDisplayValue: {

		}
	},

	dependencies: ['getLegislationStatusService', 'getLegislationsService', 'getProjectsService', 'getBusinessUnitsService', 'getUsersService',
		'getProjectService', 'saveProjectService'],

	data() {
		return {
			isEditMode: false,
			loading: {
				general: true,
				save: false,
				cancel: false
			},
			users: [],
			project: {},
			hasChanges: false,
			legislations: [],
			legislationStatus: [],
			isLoading: false,
			isActive:true
		};
	},

	beforeRouteLeave(to, from, next) {
		if (this.isEditMode && this.hasChanges) {
			this.$buefy.dialog.confirm({
				title: 'Cancel',
				message: 'Are you sure you want to leave this page?',
				confirmText: 'Yes',
				cancelText: 'Close',
				type: 'is-danger',
				hasIcon: true,
				onCancel: () => next(false),
				onConfirm: () => next()
			});
		} else {
			next();
		}
	},

	async mounted() {
		this.isEditMode = !!this.$route.query.isEdit;

		try {
			this.legislations = await this.getLegislationsService.getAsync();
			this.legislationStatus = await this.getLegislationStatusService.getAsync();
			this.users = await this.getUsersService.getAsync();
			this.project = await this.getProjectService.getAsync(this.$route.params.id);
		} catch (ex) {
			console.error(ex);
		} finally {
			this.loading.general = false;
		}
	},

	watch: {
		project: {
			handler(newValue, oldValue) {
				if (!newValue || !oldValue)
					return;

				this.hasChanges = true;
			},
			deep: true
		},

		isEditMode(newValue) {
			this.$router.replace({
				query: { ...this.$route.query, isEdit: newValue || null }
			}).catch(e => e);

			if (newValue) {
				// window.onbeforeunload = function() {
				// 	return 'Are you sure you want to close the window?';
				// };
			} else {
				// window.onbeforeunload = () => {};
			}
		}
	},

	computed: {
		canFinalizeProject() {
			return this.project?.status && toLower(this.project?.status?.name) != 'finished';	
		},

		isEmptyProject() {
			return isEmpty(this.project);
		}
	},

	methods: {
		closeProject() {
			this.$router.push(`/projects/${this.project.id}/close`);
		},

		async saveProjectAsync() {
			this.isActive = false;
			this.loading.save = true;
			// this.loading = true;
			
			try {
				if (await this.$refs.form.validate()) {
					await this.saveProjectService.saveAsync(this.project);
					sessionStorage.removeItem('tagsCache');
					sessionStorage.removeItem('legislationStatusCache');
					sessionStorage.removeItem('legislationCache');
					sessionStorage.removeItem('projectCache');

					this.isEditMode = false;
					this.hasChanges = false;

					this.$buefy.snackbar.open(this.$t('project.save.success.info'));
				} else {
					this.$buefy.snackbar.open(this.$t('project.save.invalid.info'));
				}
			} catch (ex) {
				console.error(ex);
				this.$buefy.snackbar.open(this.$t('project.save.error.info'));
			} finally {
				this.loading.save = false;
				// this.loading = false;
			}
		},



		onCancelProjectEdit() {
			if (this.hasChanges) {
				this.$buefy.dialog.confirm({
					title: 'Cancel',
					message: 'Are you sure you want to <b>Cancel</b> changes? This action can not be undone.',
					confirmText: 'Yes',
					cancelText: 'Close',
					type: 'is-danger',
					hasIcon: true,
					onConfirm: () => this.cancelProjectEditAsync()
				});
			} else {
				this.cancelProjectEditAsync();
			}
		},

		async cancelProjectEditAsync() {
			this.loading.cancel = true;

			try {
				this.project = await this.getProjectService.getAsync(this.project.id);
				this.isEditMode = false;
			} catch (ex) {
				console.error(ex);
			} finally {
				this.loading.cancel = false;
			}

			this.$forceUpdate();
		}
	},

	// beforeDestroy() {
	// 	window.onbeforeunload = () => {};
	// }
};
</script>

<style lang="scss" scoped>
.disabled {
  cursor: not-allowed;
  color: gray
}
</style>
