<template>
	<view-wrapper>
		<template #title>
			{{ project.name }}
		</template>
		<template #subtitle>Finalize Project</template>
		<template>
			<div>
				<template v-if="!isEmptyProject">
					
					<div class="field">
						<label class="label">Adjust legal status of substance</label>
					<div class="columns" >
						<div class="column  is-tablet-6">
							<div class="panel">
								<p class="panel-heading">Project</p>
								<b class="panel-block">
									Typ(Tonnage)/  Originator / Representative / Legislation / Registration Number
								</b>
								<a class="panel-block" v-for="item in projectTargetLegislationStatus" v-show="!isToBeAdded(item) && !isOnSubstance(item)">
								<!-- <a class="panel-block" v-for="item in projectTargetLegislationStatus"  v-show="!isOnSubstance(item)"> -->
									<legislation-status-instance  style="white-space: nowrap;"   :value="item" :expires-on="project.registrationValidUntil" :valid-from="project.registrationAtAuthorityOn"></legislation-status-instance>
									
									<span style="white-space: nowrap;" > {{getExtentionValuesForProject()}} </span>
									<button @click="toggleAdd(item)" class="button is-small ml-2"><font-awesome-icon :icon="['fas', 'plus-circle']" ></font-awesome-icon></button>
								</a>
							</div>
						</div>

						<div class="column  is-tablet-6">
							<div class="panel">
								<p class="panel-heading">
									Substance
								</p>

								<p class="panel-block">
									(applies to all projects as current status)
								</p>
								<b class="panel-block">
									Typ(Tonnage)/  Originator / Representative / Legislation / Registration Number
								</b>
								<a class="panel-block" v-for="item in project.substance.legislationStatus">
									<font-awesome-icon :icon="['fas', 'minus-circle']" class="mr-2 has-text-danger" v-if="isToBeDeactivated(item)"></font-awesome-icon>
									<div v-bind:style= "[isSimilar(item) ? {'color': 'red'} : {'color': 'black'} ]">
									<legislation-status-instance style="white-space: nowrap;" :value="item" extended :class="{'is-crossed-out': isToBeDeactivated(item)}"></legislation-status-instance>
									<Span style="white-space: nowrap;">{{getExtentionValuesForSubstance(item)}}</Span>
									<button @click="toggleDeactivate(item)" class="button is-small ml-2" v-show="!isToBeDeactivated(item) && isActive(item)"><font-awesome-icon :icon="['fas', 'trash-alt']" class="has-text-danger" ></font-awesome-icon></button>
									<button @click="toggleDeactivate(item)" class="button is-small ml-2" v-show="isToBeDeactivated(item)"><font-awesome-icon :icon="['fas', 'undo']" ></font-awesome-icon></button>
									</div>

									<div class="select is-small ml-2" v-show="isToBeDeactivated(item)">
										<select v-model="item.statusId">
											<option v-for="statusValue in statusValueSet" :value="statusValue.id" >{{ statusValue.name }}</option>
										</select>
									</div>									
								</a>

								<a class="panel-block" v-for="item in toBeAddedLegislationStatus">
									<font-awesome-icon :icon="['fas', 'plus-circle']" class="mr-2 has-text-success"></font-awesome-icon>
									<legislation-status-instance style="white-space: nowrap;" :value="item" extended></legislation-status-instance>
									<span style="white-space: nowrap;" > {{getExtentionValuesForProject()}} </span>
									<button @click="toggleDeactivate(item)" class="button is-small ml-2"><font-awesome-icon :icon="['fas', 'trash-alt']" class="has-text-danger" @click="toggleAdd(item)"></font-awesome-icon></button>
								</a>
							</div>
						</div>
					</div>
					</div>
					<button class="button is-primary" :disabled="canNotFinalized" @click="finalizeProjectAsync">Finalize Project</button>
				</template>
			</div>
		</template>
	</view-wrapper>

</template>

<script>
import { cloneDeep, isEmpty, remove, filter, toLower, findIndex, find, some } from 'lodash';
import { ValidationObserver } from 'vee-validate';
import { toValueSet } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
import { format } from 'date-fns'
import LegislationStatusComponent from './shared/LegislationStatusComponent.vue';

export default {

	dependencies: ['getLegislationStatusService', 'getLegislationsService', 'getProjectsService', 'getProjectService','getBusinessUnitsService', 'saveSubstanceService', 'saveProjectService', 'getUsersService', 'getProjectService', 'getProjectStatusService', 'getAllLegalStatusInstanceStatusService', 'getLegalEntityService'],

	data() {
		return {
			project: {},
			showDeveloperInformation: false,
			toBeDeactivatedLegislationStatus: [],
			toBeAddedLegislationStatus: [],
			isLoading: true,
			projectStatusValueSet: [],
			allInstanceStatus: [],
			deleteInstanceStatusValueSet: [],
			statusValueSet : [],
			activeInstanceStatus: null,
			inactiveInstanceStatus: null,
			inactiveInstanceStatusValueSet: [],
			statusHistory: [],
			regNo: ' ',
			legEntity: ' ',
			Legislation:' ',
			canNotFinalized: false,
			haveSimilar : false,
			isAdded: false,
			similarLegislationStatusInst:{},
			projectTargetLegislationStatus: []
		};
	},

	beforeRouteLeave(to, from, next) {
		if (this.isEditMode && this.hasChanges()) {
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

	computed: {
		isEmptyProject() {
			return isEmpty(this.project);
		},
	
		previewLegislationStatus() {
			let result = [];

			if (Array.isArray(this.project.substance.legislationStatus)) {
				if (Array.isArray(this.toBeDeactivatedLegislationStatus)) {
					this.project.substance.legislationStatus.forEach(i => {
						if (this.toBeDeactivatedLegislationStatus.indexOf(i.id) == -1)
							result.push(i);
					});
				}
			}

			if (Array.isArray(this.project.targetLegislationStatus)) {
				if (Array.isArray(this.toBeAddedLegislationStatus) && this.toBeAddedLegislationStatus.length > 0) {
					this.project.targetLegislationStatus.forEach(i => {
						if (this.toBeAddedLegislationStatus.indexOf(i.id) > -1) {
							result.push(i);
						}
					});
				}
			}

			return result;
		}
	},

	methods: {
		async finalizeProjectAsync() {
		try {
			if (Array.isArray(this.toBeAddedLegislationStatus) && this.toBeAddedLegislationStatus.length > 0) {
				this.project.targetLegislationStatus.forEach(i => {
					if (this.toBeAddedLegislationStatus.indexOf(i) > -1) {
						i.substanceId = this.project.substance.id;
						i.statusId = this.activeInstanceStatus.id;
						i.legalEntityId = this.project.legalEntityId;
						i.representativeId = this.project.representativeId;
						i.registrationNumber = this.project?.registrationNumber;
						i.expiresOn = this.project?.registrationValidUntil;
						i.validOn = this.project?.registrationAtAuthorityOn;
						this.project.substance.legislationStatus.push(i);
						console.log(i);
					}
				});
			}

			if ((Array.isArray(this.toBeAddedLegislationStatus) && this.toBeAddedLegislationStatus.length > 0) || (Array.isArray(this.toBeDeactivatedLegislationStatus) && this.toBeDeactivatedLegislationStatus.length > 0)) {
				await this.saveSubstanceService.saveAsync(this.project.substance);
			}

			// set project status

			await this.saveProjectService.saveAsync(this.project);
			this.project = await this.getProjectService.getAsync(this.project.id);
			this.toBeAddedLegislationStatus = [];
			this.haveSimilar = some(this.project?.substance?.legislationStatus, i => i.id == this.similarLegislationStatusInst?.id);
			this.projectTargetLegislationStatus = [];
			this.project.targetLegislationStatus.forEach(element => {
				let result = this.isSimilar(element);
				if(!result)
					this.projectTargetLegislationStatus.push(element);
				});
			if(this.isAdded)
			 	this.canNotFinalized = true;
			
			this.$buefy.snackbar.open(this.$t('Finalize project.save.success.info'));
			} catch (ex) {
				console.error(ex);
				this.$buefy.snackbar.open(this.$t('Finalize project.save.error.info'));
			}
		},
		isSimilar(item)
			{
				let legislationStatus = item?.legislationStatus?.legislation?.name;
				let type =  item?.tonnageName + item.legislationStatus?.name;
				let legalEntity = item?.legalEntity?.id;
				let representative = item?.representative?.id;
				let substanceId = item.substanceId;

				let legislationStatusPro = this.project?.legislation?.name;
				let legalEntityPro = this.project?.legalEntity?.id;
				let representativePro = this.project?.representative?.id;
				let typePro = item?.tonnageName + item?.legislationStatus?.name;
				let substanceIdPro = this.project.substanceId;
				if(substanceId == substanceIdPro && type == typePro && legalEntity == legalEntityPro && legislationStatus == legislationStatusPro && representative == representativePro) 
					{
						this.haveSimilar = true;
						this.similarLegislationStatusInst = item;
						return true;
					}
					else
					{
						return  false;
					}
			},
			canNotAdd(item)
			{
				let legislationStatusPro = item?.legislationStatus?.legislation?.name;
				let tonnageNamePro =  item?.tonnageName;
				let statusNamePro =  item.legislationStatus?.name;
				let legalEntityPro = item?.legalEntityId;
				let representativePro = item?.representativeId ;
				// const index = this.project.substance.legislationStatus.indexOf(x=>x?.legislationStatus?.legislation?.name == legislationStatusPro 
				// 								&& x?.tonnageName ==  tonnageNamePro && x?.legislationStatus?.name == statusNamePro
				// 								&& x?.legalEntity?.id == legalEntityPro && x?.representative?.id == representativePro
				// 								 )
				let result = this.project.substance.legislationStatus.some(x=>x?.legalEntity?.id == legalEntityPro && x?.representative?.id == representativePro
												 && x?.legislationStatus?.legislation?.name == legislationStatusPro && x?.tonnageName ==  tonnageNamePro
												 && x?.legislationStatus?.name == statusNamePro)

				return result ?? false;;
			},
		getExtentionValuesForSubstance(item)
		{
			let legalEntity= item?.legalEntity?.name;
			let representative = item.representative != null ? item.representative?.name : ' - ' ;
			let legislation = item?.legislationStatus?.legislation?.name;
			let registrationNumber = item?.registrationNumber ?? "-";
			return '|' + representative + '|' + legislation + '|' +registrationNumber;

		},

		getExtentionValuesForProject()
		{
			let legalEntity= this.project.legalEntity != null ? this.project.legalEntity?.name : ' - ';
			let representative =  this.project.representative != null ? this.project.representative?.name : ' - ';
			// let representative =   this.project.representative?.name ;
			let legislation = this.project?.legislation != null ? this.project.legislation?.name : ' - ';
			let registrationNumber = this.project?.registrationNumber ?? "-";
			return legalEntity + '|' + representative + '|' + legislation + '|' +registrationNumber;
		},


		// async getlegalEntity(item){
		// 	let legalEntity = await this.getLegalEntityService.getAsync(item);
		// 		return	legalEntity.name;
		// 		// this.getLegalEntityService.getAsync().then(le => {
		// 		// return le.name});
		// },

		toggleDeactivate(legislationStatusInstance) {
			const index = findIndex(this.toBeDeactivatedLegislationStatus, i => i?.id == legislationStatusInstance?.id);
			if (index > -1) {
				this.toBeDeactivatedLegislationStatus.splice(index, 1);
				if (legislationStatusInstance.id in this.statusHistory)
					legislationStatusInstance.statusId = this.statusHistory[legislationStatusInstance.id];
			}
			else {
				this.toBeDeactivatedLegislationStatus.push(legislationStatusInstance);
				this.statusHistory[legislationStatusInstance.id] = legislationStatusInstance.statusId;
				legislationStatusInstance.statusId = this.inactiveInstanceStatus.id;
				this.canNotFinalized = false;
			}
		},

		isToBeDeactivated(legislationStatusInstance) {
			return findIndex(this.toBeDeactivatedLegislationStatus, i => i?.id == legislationStatusInstance?.id) > -1;
		},

		isActive(legislationStatusInstance) {
			// this.legEntity = this.project?.legalEntity?.name;
			// this.Legislation = this.project.legislation.name;
			// this.regNo = this.project.registrationNumber;
			return legislationStatusInstance?.status?.isActive ?? true;
		},

		toggleAdd(legislationStatusInstance) {
			if(this.canNotAdd(legislationStatusInstance))
				{
					this.canNotFinalized = true;
					this.$buefy.snackbar.open(this.$t('Legislation Status is already existing. Adding of new Legislation Status is not possible!'));
					return;
				}
			legislationStatusInstance.statusId = this.activeInstanceStatus?.id;
			legislationStatusInstance.status = this.activeInstanceStatus;
			if (this.project?.registrationValidUntil)
				legislationStatusInstance.expiresOn = this.project.registrationValidUntil;

			if (this.project?.registrationAtAuthorityOn)
				legislationStatusInstance.validOn = this.project.registrationAtAuthorityOn;

			const index = findIndex(this.toBeAddedLegislationStatus, i => i?.id == legislationStatusInstance?.id);
			if (index > -1)
				{
					this.projectTargetLegislationStatus.push(legislationStatusInstance);
					this.toBeAddedLegislationStatus.splice(index, 1);
				}
			else
				{
					this.toBeAddedLegislationStatus.push(legislationStatusInstance);
					const indexPro = findIndex(this.projectTargetLegislationStatus, i => i?.id == legislationStatusInstance?.id);
					this.projectTargetLegislationStatus.splice(indexPro,1);
				}
		},

		isToBeAdded(legislationStatusInstance) {
			this.isAdded= findIndex(this.toBeAddedLegislationStatus, i => i?.id == legislationStatusInstance?.id) > -1;
			return this.isAdded && this.projectTargetLegislationStatus.length == 0;
		},

		isOnSubstance(legislationStatusInstance) {
			let result = some(this.project?.substance?.legislationStatus, i => i.id == legislationStatusInstance?.id && this.project?.targetLegislationStatus?.substanceId == null);
			for (let index = 0; index < this.project?.targetLegislationStatus.length; index++) {
				if ( this.project?.targetLegislationStatus[index].substanceId != null) {
					result = true;
					break;
				}
			}
			return result ?? false;
			//  return  false;
		}
	},

	beforeDestroy() {
		window.onbeforeunload = () => { };
	},

	async created() {
		try {
			this.project = await this.getProjectService.getAsync(this.$route.params.id);
			this.projectStatusValueSet = await this.getProjectStatusService.getAsync().then(v => toValueSet(filter(v, vi => toLower(vi?.status) == 'finished')));
			this.allInstanceStatus = await this.getAllLegalStatusInstanceStatusService.getAsync();
			this.activeInstanceStatus = find(this.allInstanceStatus, i => i.isActive && toLower(i?.name).includes('active'));
			this.inactiveInstanceStatus = find(this.allInstanceStatus, i => !i.isActive);
			this.inactiveInstanceStatusValueSet = filter(this.allInstanceStatus, i => !i.isActive);
			this.deleteInstanceStatusValueSet = filter(this.allInstanceStatus, i=>!i.isActive && i.name=='Delete');
			this.statusValueSet = this.haveSimilar == true && this.project.substance.legislationStatus.length == 1 ? this.deleteInstanceStatusValueSet : this.inactiveInstanceStatusValueSet;
			this.projectTargetLegislationStatus = [];
			let project = this.project;
			project.targetLegislationStatus.forEach(element => {
				let result = this.isSimilar(element);
				if(!result)
					this.projectTargetLegislationStatus.push(element);
			});
		} catch (ex) {
			console.error(ex);
		} finally {
			this.isLoading = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.is-crossed-out {
	text-decoration: line-through;
}

</style>
