<template>
	<div class="create-project-form">
		<validation-observer ref="form">
			<div>
				<div>
					<!-- <input-with-validation v-model="project.name" type="text" name="projectName" label="Name" rules="required" /> -->
					<div class="field">
						<label class="label">Name</label>
						<input type="text" v-model="project.name" class="input" />
					</div>

					<b-field label="Substance">
						<substance :substances="substances" :project="project" is-edit />
					</b-field>

					<b-field label="Project Start">
						<date-picker v-model="project.projectStart" name="projectStart" rules="required" is-edit required />
					</b-field>

					<!-- <input-with-validation v-model="project.area" inputType="select" name="area" label="Regulatory Area" rules="required" :data="areas" /> -->
					<div class="field">
						<label class="label">Regulatory Area</label>
						<input type="text" class="input" v-model="project.area" />
					</div>

					<b-field label="Legislation">
						<legislation v-model="project.legislation" referenceId="legislation" is-edit :item="project" :value-set="legislationValueSet"> </legislation>
					</b-field>

					<div class="field">
						<label class="label">{{ $t('project.targetLegislationStatus.label') }}</label>
						<legislation-status v-model="project.targetLegislationStatus" :item="project" :value-set="legislationStatusValueSet" :is-edit="true"> </legislation-status>
					</div>

					<!-- <input-with-validation v-model="project.manager" inputType="select" name="manager" label="Project Manager" rules="required" :data="users" /> -->

					<!-- <input-with-validation v-model="project.businessUnitId" inputType="select" name="businessUnitId" label="Business Unit" rules="required">
						<template #option>
							<option v-for="option in businessUnits" :value="option.id" :key="option.id">
								{{ option.name }}
							</option>
						</template>
					</input-with-validation>

					<input-with-validation v-model="project.legalEntityId" inputType="select" name="legalEntityId" label="Legal Entity" rules="required">
						<template #option>
							<option v-for="option in legalEntities" :value="option.id" :key="option.id">
								{{ option.name }}
							</option>
						</template>
					</input-with-validation>

					<input-with-validation v-model="project.businessLine" type="text" name="projectBusinessLine" label="Business Line" /> -->
				</div>
			</div>
		</validation-observer>

		<b-button type="is-primary" :loading="loading" @click="createNewProject">
			<font-awesome-icon :icon="['fas', 'save']"></font-awesome-icon>
			&nbsp;Create
		</b-button>
	</div>
</template>

<script>
	import { ValidationObserver } from 'vee-validate';
	import { ValueSetItem } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
	import { isEmpty, map, pick, orderBy } from 'lodash';
	import { v4 as uuid } from 'uuid';

	export default {
		components: {
			ValidationObserver
		},

		data() {
			return {
				loading: false,
				verification: false,
				users: [],
				substances: [],
				legislations: [],
				legislationStatus: [],
				areas: [],
				businessUnits: [],
				legalEntities: [],
				project: {
					name: '',
					substance: {},
					projectStart: new Date(),
					legislation: {},
					targetLegislationStatus: [],
					manager: '',
					businessUnitId: '',
					area: '',
					legalEntityId: '',
					businessLine: ''
				}
			};
		},

		dependencies: ['getLegislationStatusService', 'getLegislationsService', 'getBusinessUnitsService', 'getLegalEntitiesService'],

		async created() {
			try {
				this.users = orderBy(await this.$userService.getUsersAsync(), e => e.name);
				this.substances = orderBy(await this.$substanceService.getSubstancesAsync(), e => e.name);
				this.legislations = await this.getLegislationsService.getAsync();
				this.legislationStatus = await this.getLegislationStatusService.getAsync();
				this.areas = orderBy(await this.$projectService.getAreasAsync(), e => e.name);
				this.businessUnits = orderBy(await this.getBusinessUnitsService.getAsync(), e => e.name);
				this.legalEntities = orderBy(await this.getLegalEntitiesService.getAsync(), e => e.name);
			} catch (ex) {
				console.error(ex);
			}
		},

		computed: {
			legislationValueSet() {
				return map(this.legislations, legislation => new ValueSetItem(legislation, legislation.name));
			},

			legislationStatusValueSet() {
				if (!Array.isArray(this.legislationStatus) || this.legislationStatus.length < 1) return [];

				return this.legislationStatus.map(ls => new ValueSetItem(ls, ls.name));
			}
		},

		methods: {
			async createNewProject() {
				try {
					this.targetLegislationEmpty = false;
					const valid = await this.$refs.form.validate();

					if (!valid) {
						return this.$buefy.toast.open({
							duration: 3000,
							message: `Please, fill all fields`,
							position: 'is-bottom-right',
							type: 'is-danger'
						});
					}

					// if (isEmpty(this.project.targetLegislationStatus)) {
					// 	this.targetLegislationEmpty = true;
					// 	return this.$buefy.toast.open({
					// 		duration: 3000,
					// 		message: `Please, provide Target Legislation Status`,
					// 		position: 'is-bottom-right',
					// 		type: 'is-danger'
					// 	});
					// }

					const data = this.getPayload();
					this.loading = true;
					const resp = await this.$projectService.createNewProjectAsync(data);
					let routeData = this.$router.resolve({
						path: `/projects/${resp.id}`,
						query: { isEdit: true }
					});
					window.open(routeData.href, '_blank');
				} catch (ex) {
					console.error(ex);
				} finally {
					this.loading = false;
				}
			},

			getPayload() {
				const id = uuid();

				return {
					id,
					name: this.project.name,
					substance: this.project.substance,
					startAt: this.project.projectStart,
					legislation: this.project.legislation || null,
					targetLegislationStatus: this.project.targetLegislationStatus,
					manager: this.project.manager,
					businessUnitId: this.project.businessUnitId || null,
					area: this.project.area,
					legalEntityId: this.project.legalEntityId || null,
					businessLine: this.project.businessLine || null,
					identifiers: this.getProjectIdentifiers(id)
				};
			},

			getProjectIdentifiers(projectId) {
				const generateKey = obj => ({ id: uuid(), projectId, ...obj });
				const fields = ['key', 'value'];
				const identifiers = map(this.project.substance.identifiers, identifier => pick(identifier, fields));

				return map(identifiers, generateKey);
			}
		}
	};
</script>

<style scoped>
	.btn-save {
		margin-bottom: 24px;
	}
</style>
