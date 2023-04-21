<template>
	<view-wrapper is-narrow>
		<template v-slot:title>{{ $t('createProject.title') }}</template>
		<div>
			<!-- <input-with-validation v-model="project.name" type="text" name="projectName" label="Name" rules="required" /> -->
			<div class="field">
				<label class="label">Name</label>
				<input type="text" v-model="project.name"  @input="projectnameChange(project.name)" class="input" />
				<b-field v-show="!hasProjectname" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.type.label') }}</label>
				<select-rw v-model="project.type" :reference-value.sync="project.typeId" :value-set="projectTypeValueSet" @input="projecttypeChange(project.type)"  is-edit></select-rw>
				<b-field v-show="!hasProjecttype" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.substance.label') }}</label>
				<select-rw :item="project" :is-search="true" v-model="project.substance" :reference-value.sync="project.substanceId" :value-set="substanceValueSet" @keyup="substanceChange(project.substance)"  @input="substanceChange(project.substance)" is-edit></select-rw>
				<b-field v-show="!hasSubstance" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.startAt.label') }}</label>
				<input-date-rw v-model="project.startAt"></input-date-rw>
			</div>

			<div class="field">
				<label class="label">{{ $t('project.area.label') }}</label>
				<select-rw :item="project" :is-search="true" v-model="project.area" :reference-value.sync="project.areaId" :value-set="areaValueSet" @input="areaChange(project.area)" is-edit></select-rw>
				<b-field v-show="!hasArea" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.legislation.label') }}</label>
				<legislation v-model="project.legislation" referenceId="legislation" is-edit :item="project" :value-set="legislationValueSet"  @input="legislationChange(project.legislation)"> </legislation>
				<b-field v-show="!hasLegislation" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.targetLegislationStatus.label') }}</label>
				<legislation-status v-model="project.targetLegislationStatus" :item="project" :value-set="legislationStatusValueSet" is-edit> </legislation-status>
			</div>

			<div class="field">
				<label class="label">{{ $t('project.manager.label') }}</label>
				<select-rw :item="project" :is-search="true" v-model="project.manager" :reference-value.sync="project.managerUserId" :value-set="userValueSet"  @input="responsibleChange(project.manager)" is-edit></select-rw>
				<b-field v-show="!hasResponsible" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.businessUnit.label') }}</label>
				<select-rw :item="project" :is-search="true" v-model="project.businessUnit" :reference-value.sync="project.businessUnitId" :value-set="businessUnitValueSet" @input="businessunitChange(project.businessUnit)" is-edit></select-rw>
				<b-field v-show="!hasBusinessunit" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.legalEntity.label') }}</label>
				<select-rw :item="project" :is-search="true" v-model="project.legalEntity" :reference-value.sync="project.legalEntityId" :value-set="legalEntityValueSet" @input="originatorChange(project.legalEntity)" is-edit></select-rw>
				<b-field v-show="!hasOriginator" :type="{'is-danger': true }" :message="errorMessage">
			</div>

			<div class="field">
				<label class="label">{{ $t('project.businessLine.label') }}</label>
				<input type="text" class="input" v-model="project.businessLine" />
			</div>

			<div class="field">
				<div class="buttons">
					<button :disabled="!canCreate" class="button is-primary" @click="createNewProject(false)">
						<font-awesome-icon :icon="['fas', 'save']" class="mr-2"></font-awesome-icon>
						{{ $t('createProjectView.create') }}
					</button>
					<button :disabled="!canCreate" class="button is-primary" @click="createNewProject(true)">
						<font-awesome-icon :icon="['fas', 'save']" class="mr-2"></font-awesome-icon>
						{{ $t('createProjectView.createAndNew') }}
					</button>
				</div>
			</div>
		</div>
		
	</view-wrapper>
</template>

<script>
	import { ValidationObserver } from 'vee-validate';
	import { ValueSetItem, toValueSetWithIdentifiers, toValueSet } from 'lanxess-frontend/vuejs/ValueSet';
	import { isEmpty, map, pick, orderBy } from 'lodash';
	import { v4 as uuid } from 'uuid';
	import { Project } from '../models/Project'
import { tr } from 'date-fns/locale';

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
				legalEntityValueSet: [],
				projectTypeValueSet: [],
				project: new Project(),
				errorMessage: "*",
				hasProjectname: false,
				hasProjecttype: false,
				hasSubstance : false,
				hasArea : false,
				hasLegislation : false,
				hasResponsible : false,
				hasBusinessunit: false,
				hasOriginator : false,
				canCreate : false
			};
		},

		dependencies: ['getLegislationStatusService', 
			'getLegislationsService', 
			'getBusinessUnitsService', 
			'getLegalEntitiesService', 
			'getUsersService', 
			'getSubstancesService', 
			'getAreasService', 
			'saveProjectService',
			'getProjectTypesService'
		],

		async created() {
			try {
				let p = [];
				this.users = orderBy(await this.getUsersService.getAsync(), e => e.name);
				this.substances = orderBy(await this.getSubstancesService.getAsync(), e => e.name);
				this.legislations = await this.getLegislationsService.getAsync();
				this.legislationStatus = await this.getLegislationStatusService.getAsync();
				this.areas = orderBy(await this.getAreasService.getAsync(), e => e.name);
				this.businessUnits = orderBy(await this.getBusinessUnitsService.getAsync(), e => e.name);
				p.push(this.getLegalEntitiesService.getAsync().then(v => this.legalEntityValueSet = toValueSet(v, 'sapL4PId')));
				p.push(this.getProjectTypesService.getAsync().then(v => this.projectTypeValueSet = toValueSet(v)));
				await Promise.all(p);
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
			},

			areaValueSet() {
				return toValueSet(this.areas);
			},

			userValueSet() {
				return toValueSet(this.users);
			},

			substanceValueSet() {
				return toValueSetWithIdentifiers(this.substances, i => {
					return i.identifiers;
				});
			},

			businessUnitValueSet() {
				return toValueSet(this.businessUnits, 'abbreviation');
			}
		},

		methods: {
			async createNewProject(addNext = false) {
				try {
					this.targetLegislationEmpty = false;

					this.loading = true;
					let dd = this.project;
					const resp = await this.saveProjectService.saveAsync(this.project);
					const routeData = {
						path: `/projects/${this.project.id}`,
						query: { isEdit: true }
					};
					console.log(routeData);

					if (addNext) {
						this.project = new Project();
						this.$buefy.toast.open({
							duration: 5000,
							message: this.$t('createProjectView.createSuccess'),
							type: 'is-success',
							pauseOnHover: true
						});
					}
					else
						this.$router.push(routeData);
					
				} 
				catch (ex) {
					console.error(ex);
					this.$buefy.toast.open({
						duration: 5000,
						message: this.$t('createProjectView.createUnknownError'),
						type: 'is-error',
						pauseOnHover: true
					});
				} 
				finally {
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
			},

			projectnameChange(val) {
			this.hasProjectname = val.length >0 ? true :false;
            this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
        	},
			projecttypeChange(val) {
				this.hasProjecttype = val.id != null ? true :false;
	            this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
        	},
			substanceChange(val){
				this.hasSubstance = val.name != null ? true :false;
                this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
			},
			areaChange(val){
				this.hasArea = val.name != null ? true :false;
			    this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
			},
			legislationChange(val){
				this.hasLegislation = val.name != null ? true :false;
			    this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
			},
			responsibleChange(val){
				this.hasResponsible = val.name != null ? true :false;
			    this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
			},
			businessunitChange(val){
				this.hasBusinessunit = val.name != null ? true :false;
			    this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
			},
			originatorChange(val){
				this.hasOriginator = val.name != null ? true :false;
			    this.canCreate = this.hasProjectname && this.hasProjecttype && this.hasSubstance && this.hasArea && this.hasLegislation && this.hasResponsible && this.hasBusinessunit && this.hasOriginator;
			}
		}
	};
</script>

<style lang="scss" scoped></style>
