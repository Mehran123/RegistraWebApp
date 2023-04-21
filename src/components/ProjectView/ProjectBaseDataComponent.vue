<template>
	<div class="columns is-8">
		<div class="column is-one-third">

			<div class="box">
				<h2 class="title is-5">{{ $t('projectDetailsView.baseData.heading.projectInformation') }}</h2>
				<data-field reference-id="Project.No" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.no.label')">
						<input-rw v-model="props.item.no" v-bind="props" :is-edit="false"></input-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.LeadProjectNo" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.projectLead.label')">
						<input-rw v-model="props.item.leadProjectNo" v-bind="props" :is-edit="false"></input-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.IsUpdate" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isUpdate.label')"> 
						<input-three-state-boolean-rw v-model="props.item.isUpdate" v-bind="props" ></input-three-state-boolean-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.Type" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.type.label')">
						<select-rw v-model="props.item.type" :reference-value.sync="props.item.typeId" :value-set="projectTypeValueSet" v-bind="props"></select-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.Status" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.status.label')">
						<select-rw v-model="props.item.status" :reference-value.sync="props.item.statusId" v-bind="props" :value-set="statusValueSet"></select-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.CeficCode" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.ceficCode.label')">
						<select-rw :item="props.item" v-model="props.item.ceficCode" :reference-value.sync="props.item.ceficCodeId" :value-set="ceficCodeValueSet" v-bind="props"></select-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.Tags" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.tags.label')">
						<tags-rw v-model="props.item.tags" v-bind="props" :existing-tags="existingTags"></tags-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.RegistrationName" v-slot="props" v-bind="defaultDataFieldProperties"> 
						
						<field :label.once="$t('project.registrationName.label')">
							<div  v-if="canEdit">
						<b-autocomplete open-on-focus clearable 
                        v-model="props.item.registrationName" 
                        :data="filteredDataArray(props.item.registrationName)"
                        placeholder=""
                        @select="option => registration.selected = option">
                    </b-autocomplete>
					</div>
					
					<div  v-else> <span>{{ props.item.registrationName }}</span></div>
					</field>
				</data-field>
			</div>


			<div class="box">
				<h2 class="title is-5">{{ $t('projectDetailsView.baseData.heading.legalInformation') }}</h2>

				<data-field reference-id="Project.Area" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.area.label')">
						<select-rw is-search v-model="props.item.area" :reference-value.sync="props.item.areaId" :value-set="areaValueSet" v-bind="props"></select-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.LegalEntity" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.legalEntity.label')">
						<select-rw v-model="props.item.legalEntity" :reference-value.sync="props.item.legalEntityId" :value-set="legalEntityValueSet" v-bind="props"></select-rw>
					</field>
				</data-field>
				
				<data-field reference-id="Project.representative" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.representative.label')">
						<select-rw v-model="props.item.representative" :reference-value.sync="props.item.representativeId" :value-set="representativeValueSet" v-bind="props"></select-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.Legislation" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.legislation.label')">
						<legislation v-model="props.item.legislation" :reference-value.sync="props.item.legislationId" v-bind="props" :value-set="legislationValueSet"></legislation>
					</field>
				</data-field>

				<data-field reference-id="Project.CurrentLegislationStatus"  v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.currentLegislationStatus.label')">
						<current-legislation-status :item="props.item"></current-legislation-status>
					</field>
				</data-field> 

				<data-field reference-id="Project.TargetLegislationStatus" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.targetLegislationStatus.label')">
						<legislation-status v-model="props.item.targetLegislationStatus" v-bind="props" :value-set="legislationStatusValueSet" > </legislation-status>
					</field>
				</data-field>
			</div>


			<div class="box">
				<h2 class="title is-5">{{ $t('projectDetailsView.baseData.heading.substanceInformation') }}</h2>
				<data-field reference-id="Project.Name" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.name.label')">
						<div v-model="props.item.substance.name"  v-bind="props" >{{props.item.substance.name}}</div>
					</field>
				</data-field>

				<data-field reference-id="Project.Substance" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('substance.aliases.label')">
						<div>{{aliasesToCommaSperated(props.item.substance.aliases)}}</div>
						<!-- <select-rw is-search v-model="props.item.substance" :reference-value.sync="props.item.substanceId" :value-set="substanceValueSet" v-bind="props"></select-rw> -->
						<!-- <div v-if="$has(props, 'item.substance.dossierQuality.name')">({{ $t('substance.dossierQuality.label') }}: {{ props.item.substance.dossierQuality.name }})</div> -->
					</field>
				</data-field>
				<data-field reference-id="Project.substanceType" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('substance.substanceType.label')">
						<input-rw v-model="props.item.substanceType" v-bind="props" :is-edit="false"></input-rw>
					</field>
				</data-field>

					<data-field  reference-id="Project.Substance" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('substance.dossierQuality.label')">
						<div v-if="$has(props, 'item.substance.dossierQuality.name')">{{ props.item.substance.dossierQuality.name }}</div>
					</field>
				</data-field>
				<data-field reference-id="Project.Substance.Identifiers" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.identifiers.label')">
						<input-identifiers-rw v-model="props.item.substance.identifiers" v-bind="props" :predefined-keys="identifierKeys" :is-edit="false"></input-identifiers-rw>
					</field>
				</data-field>
				<div v-if="isReach">
				<!-- <div > -->
				<data-field reference-id="Project.Substance.IsPbt" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isPbt.label')">
						<input-three-state-boolean-rw v-model="props.item.substance.isPbt" v-bind="props" :is-edit="false"></input-three-state-boolean-rw>
					</field>
				</data-field>
					<data-field reference-id="Project.Substance.IsListedOnAnnex" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isListedOnAnnex.label')">
						<input-three-state-boolean-rw v-model="props.item.substance.isListedOnAnnex" v-bind="props" :is-edit="false"></input-three-state-boolean-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.Substance.IsListedOnAuth" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isListedOnAuth.label')">
						<input-three-state-boolean-rw v-model="props.item.substance.isListedOnAuth" v-bind="props" :is-edit="false"></input-three-state-boolean-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.Substance.IsListedOnCandidatelist" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isListedOnCandidatelist.label')">
						<input-three-state-boolean-rw v-model="props.item.substance.isListedOnCandidatelist" v-bind="props" :is-edit="false"></input-three-state-boolean-rw>
					</field>
				</data-field>
				</div>
			</div>
		</div>

		<div class="column is-one-third boolean-values">
				<div class="box">
				<h2 class="title is-5">{{ $t('projectDetailsView.baseData.heading.contactInformation') }}</h2>		

				<data-field reference-id="Project.Manager" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.manager.label')">
						<select-rw v-model="props.item.manager" :reference-value.sync="props.item.managerUserId" :value-set="usersValueSet" v-bind="props" is-search></select-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.LocalManager" v-slot="props" v-bind="defaultDataFieldProperties" :value-set="usersValueSet">
					<field :label.once="$t('project.localManager.label')">
						<select-rw v-model="props.item.localManager" :reference-value.sync="props.item.localManagerUserId" v-bind="props" is-search></select-rw>
					</field>
				</data-field>

				 <data-field reference-id="Substance.ExpertUser" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('substance.expertUser.label')">
						<input-rw v-model="getExpertUser" v-bind="props" :is-edit="false" />
					</field>
				</data-field> 

				<data-field reference-id="Project.BusinessUnitContact" v-slot="props" v-bind="defaultDataFieldProperties" :value-set="usersValueSet">
					<field :label.once="$t('project.businessUnitContact.label')">
						<select-rw v-model="props.item.businessUnitContact" :reference-value.sync="props.item.businessUnitContactUserId" v-bind="props" is-search></select-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.BusinessUnit" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.businessUnit.label')">
						<select-rw v-model="props.item.businessUnit" :reference-value.sync="props.item.businessUnitId" display-path="abbreviation" v-bind="props" :value-set="businessUnitValueSet" />
					</field>
				</data-field>

				<data-field reference-id="Project.BusinessLine" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.businessLine.label')">
						<input-rw v-model="project.businessLine" v-bind="props" />
					</field>
				</data-field>
			</div>
			<div class="box">
				<h2 class="title is-5">{{ $t('projectDetailsView.baseData.heading.eUReachSpecific') }}</h2>	
				<data-field reference-id="Project.IsLabelingRequired" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isLabelingRequired.label')">
						<input-three-state-boolean-rw v-model="props.item.isLabelingRequired" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.IsEsdsRequired" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isEsdsRequired.label')">
						<input-three-state-boolean-rw v-model="props.item.isEsdsRequired" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.IsConsortium" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isConsortium.label')">
						<input-three-state-boolean-rw v-model="props.item.isConsortium" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.IsNano" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isNano.label')">
						<input-three-state-boolean-rw v-model="props.item.isNano" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.IsReadAcross" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isReadAcross.label')">
						<input-three-state-boolean-rw v-model="props.item.isReadAcross" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.IsDossierAvailableForPurchase" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isDossierAvailableForPurchase.label')">
						<input-three-state-boolean-rw v-model="props.item.isDossierAvailableForPurchase" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>
				
				<data-field reference-id="Project.IsDisabled" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isDisabled.label')">
						<input-three-state-boolean-rw v-model="props.item.isDisabled" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>

				<data-field reference-id="Project.IsNonPhaseIn" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.isNonPhaseIn.label')">
						<input-three-state-boolean-rw v-model="props.item.isNonPhaseIn" v-bind="props"></input-three-state-boolean-rw>
					</field>
				</data-field>
				<data-field reference-id="Project.gpM4" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.gPM4.label')">
						<input-three-state-boolean-rw v-model="props.item.gpM4" v-bind="props" :is-edit="false"></input-three-state-boolean-rw>
					</field>
				</data-field>
			</div>

			<div class="box">
				<h2 class="title is-5">{{ $t('projectDetailsView.baseData.heading.lanxessRoles') }}</h2>

				<div class="columns">
					<div class="column">
						<data-field reference-id="Project.HasRoleOwnUse" v-slot="props" v-bind="defaultDataFieldProperties">
							<field :label.once="$t('project.hasRoleOwnUse.label')">
								<input-three-state-boolean-rw v-model="props.item.hasRoleOwnUse" v-bind="props"></input-three-state-boolean-rw>
							</field>
						</data-field>
					</div>
					<div class="column">
						<data-field reference-id="Project.HasRoleOnlyRepresentative" v-slot="props" v-bind="defaultDataFieldProperties">
							<field :label.once="$t('project.hasRoleOnlyRepresentative.label')">
								<input-three-state-boolean-rw v-model="props.item.hasRoleOnlyRepresentative" v-bind="props"></input-three-state-boolean-rw>
							</field>
						</data-field>
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<data-field reference-id="Project.HasRoleImporter" v-slot="props" v-bind="defaultDataFieldProperties">
							<field :label.once="$t('project.hasRoleImporter.label')">
								<input-three-state-boolean-rw v-model="props.item.hasRoleImporter" v-bind="props"></input-three-state-boolean-rw>
							</field>
						</data-field>
					</div>
					<div class="column">
						<data-field reference-id="Project.HasRoleManufacturer" v-slot="props" v-bind="defaultDataFieldProperties">
							<field :label.once="$t('project.hasRoleManufacturer.label')">
								<input-three-state-boolean-rw v-model="props.item.hasRoleManufacturer" v-bind="props"></input-three-state-boolean-rw>
							</field>
						</data-field>
					</div>
				</div>
			</div>

		</div>

		<div class="column">
			<div class="box">
				<data-field v-slot="props" reference-id="Project.Notes" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.notes.label') }}</label>
					<div class="field">
						<notes-tasks-rw v-model="props.item.notes" v-bind="props" category="Default" />
					</div>
				</data-field>
			</div>
		</div>
	</div>
</template>

<script>

import { ValueSetItem, getOrderedValueSet, toValueSet } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
import { toValueSetWithIdentifiers } from 'lanxess-frontend/vuejs/ValueSet';
import _ from 'lodash';
import { statuses } from '../../helpers/constants';

export default {
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

		defaultNoValueDisplayValue: {
			type: String,
		},

		isEditMode: {
			type: Boolean,
			default: false
		}
	},

	dependencies: [
		'getBusinessUnitsService',
		'getLegalEntitiesService',
		'getCeficCodesService',
		'getSubstancesService',
		'getAreasService',
		'getProjectStatusService',
		'getIdentifiersService',
		'getProjectTypesService',
		'getTagsService',
		'getregistrationNamesService',
		'getLegislationStatusService',
		'getLegislationsService',
		'getLegislationStatusService',
		'getLegislationsService'
	],

	data() {
		return {
			ceficCodes: [],
			status,
			businessUnits: [],
			legalEntities: [],
			representatives: [],
			areas: [],
			substances: [],
			currentPerson: this.project.managerUserId,
			identifierKeys: [],
			projectTypes: [],
			existingTags: [],
			canEdit: this.isEditMode,
			registration:{
				registrationNames:[],
				name:'',
				selected:null
			},
			legislationStatus: [],
			legislations: []
			
		};
	},

	async created() {
		try {
			let p = [];
			p.push(this.getAreasService.getAsync().then((v) => this.areas = v));
			p.push(this.getSubstancesService.getAsync().then((v) => this.substances = v));
			p.push(this.getBusinessUnitsService.getAsync().then((v) => this.businessUnits = v));
			p.push(this.getLegalEntitiesService.getAsync().then((v) => this.legalEntities = v));
			p.push(this.getLegalEntitiesService.getAsync().then((v) => this.representatives = v));
			p.push(this.getCeficCodesService.getAsync().then((v) => this.ceficCodes = v));
			p.push(this.getregistrationNamesService.getAsync().then((v) =>  v.forEach((item) => this.registration.registrationNames.push(item))));
			p.push(this.getProjectStatusService.getAsync().then((v) => this.status = v));
			p.push(this.getIdentifiersService.getAsync().then((v) => this.identifierKeys = v));
			p.push(this.getProjectTypesService.getAsync().then((v) => this.projectTypes = v));
			p.push(this.getTagsService.getAsync().then((v) => this.existingTags = v));
			p.push(this.getLegislationStatusService.getAsync().then((v) => this.legislationStatus = v));
			p.push(this.getLegislationsService.getAsync().then((v) => this.legislations = v));
			await Promise.all(p);
		} catch (ex) {
			console.error(ex);
		}
	},

	computed: {
		defaultDataFieldProperties() {
			return {
				showDeveloperInformation: this.showDeveloperInformation,
				isEdit: this.isEditMode,
				item: this.project,
				noValueDisplayValue: this.defaultNoValueDisplayValue,
				// itemAliace: aliasesToCommaSperated(this.project.substances.aliases)
			}
		},
		isReach(){
			return this.project.legislation.name == 'REACH'
		},
		ceficCodeValueSet() {
			return toValueSet(this.ceficCodes);
		},
		registrationValueSet() {
			return toValueSet(this.registrationName);
		},

		usersValueSet() {
			return toValueSet(this.users);
		},

		legislationValueSet() {
			return toValueSet(this.legislations);
		},

		areaValueSet() {
			return toValueSet(this.areas);
		},
		getExpertUser()
		{
			const exportUser = this.project.substance.expertUser;
			if(exportUser){
				return exportUser.name;
			}
		},
		legislationStatusValueSet() {
				if (!Array.isArray(this.legislationStatus) || this.legislationStatus.length < 1) return [];

				return this.legislationStatus.map(ls => new ValueSetItem(ls, ls?.name));
			},
		businessUnitValueSet() {
			return toValueSet(this.businessUnits, 'abbreviation');
		},

		legalEntityValueSet() {
			return toValueSet(this.legalEntities, i => `${i?.name} (${i.sapL4PId})`);
		},
		
		representativeValueSet() {
			return toValueSet(this.representatives, i => `${i?.name} (${i.sapL4PId})`);
		},

		statusValueSet() {
			return toValueSet(this.status);
		},

		projectTypeValueSet() {
			return toValueSet(this.projectTypes);
		},

		substanceValueSet() {
			return toValueSetWithIdentifiers(this.substances, i => {
				return i.identifiers;
			});
		}
	},

	methods: {
		filteredDataArray(name) {
                            return this.registration.registrationNames.filter((option) => {
                                return option
                                    .toString()
                                    .toLowerCase()
									.indexOf(name?.toLowerCase()) >= 0
                            })
                        },
		aliasesToCommaSperated: function(alias){
			var projStr = JSON.stringify(this.project.substance.aliases);
			var proj = JSON.parse(projStr);

			let aliasNameArray =  _.map(proj, o => _.pick(o, ['name']));
			var jsArray =[];
			for (var i in aliasNameArray) {
				jsArray.push(aliasNameArray[i]?.name);
				
			}
			let aliasesCommasperated = jsArray.join(", ");
		   return aliasesCommasperated;
		},
		getGpM4(project){
			let result = false;
			if(project?.businessUnit?.abbreviation == 'SGO')
			{
				result = project?.substance?.gpM4;
			}
			
			return result;
		}
	}
};
</script>

<style>
.boolean-values .column:first-of-type {
	justify-content: flex-end;
	text-align: right;
}
</style>