<template>
	<view-wrapper>
		<!-- <template #title>{{ substanceName }}</template> -->
		<template #title>
			<data-field reference-id="Substance.name" v-slot="props" v-bind="defaultDataFieldProperties" class="field">
						<input-rw v-model="props.item.name" v-bind="props"></input-rw>
			</data-field>
		</template>
		<template #subtitle>Substance</template>
		<template #beforeContent v-if="isValidSubstance">
			<nav class="navbar is-primary mb-2" role="navigation" aria-label="dropdown navigation">
				<div class="container">
					<div class="navbar-start">
						<a class="navbar-item" @click="isEditMode = true" v-show="!isEditMode">
							<font-awesome-icon :icon="['fas', 'pen']" class="mr-2"></font-awesome-icon>
							Edit
						</a>
						<a class="navbar-item is-warning" v-show="isEditMode" @click="saveSubstanceAsync">
							<font-awesome-icon :icon="['fas', 'save']" class="mr-2"></font-awesome-icon>
							Save
						</a>
						<a class="navbar-item is-primary" v-show="isEditMode" @click="onCancelSubstanceEdit">
							<font-awesome-icon :icon="['fas', 'ban']" class="mr-2"></font-awesome-icon>
							Cancel
						</a>
					</div>
				</div>
			</nav>
		</template>
		<template v-if="isValidSubstance">
			<div class="columns">
				<div class="column is-6-tablet is-3-desktop is-5-fullhd">

					<data-field reference-id="Substance.DossierQuality" v-slot="props" :item="substance" v-bind="defaultDataFieldProperties" class="field">
						<label class="label">{{ $t('substance.dossierQuality.label') }}</label>
						<select-rw v-model="props.item.dossierQuality" :reference-value.sync="props.item.dossierQualityId" :value-set="dossierQualityValueSet" v-bind="props"></select-rw>
					</data-field>

					<data-field reference-id="Substance.Aliases" v-slot="props" v-bind="defaultDataFieldProperties" class="field">
						<label class="label">{{ $t('substance.aliases.label') }}</label>
						<aliases-rw v-model="props.item.aliases" v-bind="props"></aliases-rw>
					</data-field>

					<data-field reference-id="Substance.Identifiers" v-slot="props" v-bind="defaultDataFieldProperties" class="field">
						<label class="label">{{ $t('substance.identifiers.label') }}</label>
						<input-identifiers-rw v-model="props.item.identifiers" v-bind="props" :predefined-keys="identifierKeys" identifier-reference-id="substanceId"></input-identifiers-rw>
					</data-field>
				</div>
				<div class="column is-offset-1">
					<data-field reference-id="Substance.SpecificationId" v-slot="props" v-bind="defaultDataFieldProperties" class="field">
						<label class="label">{{ $t('substance.specificationId.label') }}</label>
						<input-rw v-model="props.item.specificationId" v-bind="props"></input-rw>
					</data-field>

					<data-field reference-id="Substance.ExpertUser" v-slot="props" v-bind="defaultDataFieldProperties" class="field">
						<label class="label">{{ $t('substance.expertUser.label') }}</label>
						<select-rw v-model="props.item.expertUser" :reference-value.sync="props.item.expertUserId" :value-set="usersValueSet" v-bind="props"></select-rw>
					</data-field>
					<div class="box" v-show="isEditMode">
						<b class="title is-5">{{ $t('substance.addSubstanceType.label') }}</b><p style="color:blue;">{{ $t('substance.addSubstanceTypeExtension.label')}}</p>
					<br>	 
					<data-field reference-id="substanceTypeLinks.legislation" v-slot="props" :item="substance" v-bind="defaultDataFieldProperties" >
						<div v-show="isEditMode">
							<label class="label" >{{ $t('substance.legislation.label') }}</label>
						</div>
						<select-rw v-show="isEditMode" :item="substanceTypeLink" v-model="substanceTypeLink.legislation" :reference-value.sync="substanceTypeLink.id" :value-set="legislationNewValueSet"  :is-edit="isEditMode" @change-data="onChanged(ev)" ></select-rw>
					</data-field>
					<data-field reference-id="substanceTypeLink.substanceType" v-slot="props" v-bind="defaultDataFieldProperties" >
						<div v-show="isEditMode">
							<label class="label">{{ $t('substance.substanceType.label') }}</label>
						</div>
					<select-rw v-show="isEditMode" v-model="substanceTypeLink.substanceType" :reference-value.sync="substanceTypeLink.id" :value-set="substanceTypeValueSet" :is-edit="isEditMode"></select-rw>
				</data-field>
					</div>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<!-- <h5 class="title is-size-4">Substance Types</h5> -->
					<b-tabs>
						<b-tab-item label="Eu-Reach">
							<data-field reference-id="Substance.IsPbt" v-slot="props" v-bind="defaultDataFieldProperties">
								<field :label.once="$t('project.isPbt.label')">
								<input-three-state-boolean-rw v-model="props.item.isPbt" v-bind="props"></input-three-state-boolean-rw>
							</field>
							</data-field>
							<data-field reference-id="Substance.IsListedOnAnnex" v-slot="props" v-bind="defaultDataFieldProperties">
								<field :label.once="$t('project.isListedOnAnnex.label')">
								<input-three-state-boolean-rw v-model="props.item.isListedOnAnnex" v-bind="props"></input-three-state-boolean-rw>
							</field>
							</data-field>
								<data-field reference-id="Substance.IsListedOnAuth" v-slot="props" v-bind="defaultDataFieldProperties">
								<field :label.once="$t('project.isListedOnAuth.label')">
							<input-three-state-boolean-rw v-model="props.item.isListedOnAuth" v-bind="props"></input-three-state-boolean-rw>
							</field>
							</data-field>
								<data-field reference-id="Substance.IsListedOnCandidatelist" v-slot="props" v-bind="defaultDataFieldProperties">
								<field :label.once="$t('project.isListedOnCandidatelist.label')">
							<input-three-state-boolean-rw v-model="props.item.isListedOnCandidatelist" v-bind="props"></input-three-state-boolean-rw>
							</field>
							</data-field>
							<data-field reference-id="Substance.gpM4" v-slot="props" v-bind="defaultDataFieldProperties">
								<field :label.once="$t('project.gPM4.label')">
									<input-three-state-boolean-rw v-model="props.item.gpM4" v-bind="props" ></input-three-state-boolean-rw>
								</field>
							</data-field>
							
							<hr/>
								<table class="table is-narrow has-no-cell-borders w-100">
									<thead>
										<tr>											
											<td>Legislation</td>
											<td>Substance Type</td>
										</tr>
									</thead>	
									<tbody >
										<tr  v-for="item in substance.substanceTypeLinks.filter(x=> x.legislation.area.code == 'EUE')" :key="item.id">
											<td >
													
											<data-field reference-id="item.Legislation" v-slot="props" v-bind="defaultDataFieldProperties">
													<select-rw v-model="item.legislation" :reference-value.sync="item.id" v-bind="props" :value-set="legislationValueSet" :is-edit="false"></select-rw>
											</data-field>
											</td>
											<td>
											<data-field reference-id="item.substanceType" v-slot="props" v-bind="defaultDataFieldProperties">
													<select-rw  v-model="item.substanceType" :reference-value.sync="item.id" v-bind="props" :value-set="substanceTypeValueSet" ></select-rw >
											</data-field>
											</td>
										</tr>
										
									</tbody>
								</table>
					</b-tab-item>
						<b-tab-item label="Substance-Type-RoW">
						<table class="table is-narrow has-no-cell-borders w-100">
									<thead>
										<tr>											
											<td>Legislation</td>
											<td>Substance Type</td>
										</tr>
									</thead>	
									<tbody >
										<tr  v-for="item in substance.substanceTypeLinks.filter(x=> x.legislation.area.code != 'EUE')" :key="item.id">
											<td >
													
											<data-field reference-id="item.Legislation" v-slot="props" v-bind="defaultDataFieldProperties">
													<select-rw v-model="item.legislation" :reference-value.sync="item.id" v-bind="props" :value-set="legislationValueSet" :is-edit="false"></select-rw>
											</data-field>
											</td>
											<td>
											<data-field reference-id="item.substanceType" v-slot="props" v-bind="defaultDataFieldProperties">
													<select-rw  v-model="item.substanceType" :reference-value.sync="item.id" v-bind="props" :value-set="substanceTypeValueSet" ></select-rw >
											</data-field>
											</td>
										</tr>
										
									</tbody>
								</table>	
					</b-tab-item>
					</b-tabs>
					</div>
				</div>
		</template>
	</view-wrapper>
</template>

<script>
import { cloneDeep, isEmpty, has, filter, map } from 'lodash'
import { ValueSetItem, getOrderedValueSet, toValueSet } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
import { SubstanceTypeLink } from '../models/SubstanceTypeLink'
// import { Substance } from '../models/Substance'
// import { v4 as uuid } from 'uuid'

export default {
	components: {
		
	},

	props: {
		showDeveloperInformation: {

		},
		defaultNoValueDisplayValue: {

		}
	},

	dependencies: [
		'getSubstanceService',
		'getDossierQualitiesService',
		'getIdentifiersService',
		'saveSubstanceService',
		'getUsersService',
		'getSubstanceTypesLinkService',
		'getLegislationsService',
		'getSubstanceTypesService'
	],

	data() {
		return {
			substance: null,
			dossierQualities: [],
			identifierKeys: [],
			isLoading: true,
			hasChanges: false,
			isEditMode: false,
			usersValueSet: [],
			substanceTypeLinks:[],
			substanceTypeLinkLegislations:[],
			substanceTypes:[],
			legislations:[],
			// substanceTypeLinkKeys:[],
			substanceTypeLink : new SubstanceTypeLink()
		};
	},

	async created() {
		this.isEditMode = !!this.$route.query.isEdit;

		try {
			let p = [];
			p.push(this.getIdentifiersService.getAsync().then((v) => this.identifierKeys = v));
			p.push(this.getDossierQualitiesService.getAsync().then((v) => this.dossierQualities = v));
			p.push(this.getSubstanceService.getAsync(this.$route.params.id).then((v) => this.substance = v));
			p.push(this.getSubstanceTypesLinkService.getAsync(this.$route.params.id).then((v) => this.substanceTypeLinks = v));
			
			p.push(this.getSubstanceTypesService.getAsync().then((v) => this.substanceTypes = v));
			p.push(
				this.getUsersService.getAsync().then((users) => {
					this.usersValueSet = toValueSet(users);
			})		
			);
		p.push(this.getLegislationsService.getAsync().then((v) => {
			this.legislations = v;
			const dd = this.legislations;
			this.substanceTypeLinks.forEach(element =>{
				const index =this.legislations.findIndex(i=>i.id == element.legislation.id)
				if (index != -1) {
					this.legislations.splice(index,1);
				}
			})
			
			}));
			await Promise.all(p);
		} catch (ex) {
			console.error(ex);
		} finally {
			this.isLoading = false;
		}
	},

	watch: {
		substance: {
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
		defaultDataFieldProperties() {
			return {
				showDeveloperInformation: this.showDeveloperInformation,
				isEdit: this.isEditMode,
				item: this.substance,
				noValueDisplayValue: this.defaultNoValueDisplayValue
			}
		},
		substanceName() {
			if (this.isValidSubstance)
				return this.substance.name;

			return this.$t('unknown');
		},
		isValidSubstance() {
			return has(this.substance, 'id');
		},
		dossierQualityValueSet() {
			return toValueSet(this.dossierQualities);
		},
		legislationValueSet() {
			return toValueSet(this.legislations);
		},
		substanceTypeValueSet() {
			return toValueSet(this.substanceTypes);
		},
		legislationNewValueSet() {
				return map(this.legislations, legislation => new ValueSetItem(legislation, legislation.name));
		},
	},

	methods: {
		async saveSubstanceAsync() {
			this.isLoading = true;
			try {

				var existingSubstancetypeLink = this.substance.substanceTypeLinks.filter(x=> x.legislation?.id== this.substanceTypeLink?.legislation?.id && x.substanceType?.id == this.substanceTypeLink?.substanceType?.id );

				if(existingSubstancetypeLink.length>0)
				{
					this.$buefy.snackbar.open(this.$t('substance.save.duplicate.info'));
					this.isEditMode = false;
					this.hasChanges = false;
				}
				else{
					if (this.substanceTypeLink.legislation && this.substanceTypeLink.substanceType) {
						this.substanceTypeLink.substanceId =this.substance.id;
						this.substance.substanceTypeLinks.push(this.substanceTypeLink);
					}
				
				
				let emptyIdentifiers = this.substance.identifiers.filter(x=>x.key== undefined || x.value == undefined);
				emptyIdentifiers.forEach(element => {
					let index = this.substance.identifiers.findIndex(i=>i.id == element.id)
					this.substance.identifiers.splice(index,1);
				});
				
				const subtance = this.substance;
				
				await this.saveSubstanceService.saveAsync(subtance);
				const index =this.legislations.findIndex(i=>i.id == this.substanceTypeLink?.legislation?.id)
				if (index != -1) {
					this.legislations.splice(index,1);
				}
				this.isEditMode = false;
				this.hasChanges = false;

				this.$buefy.snackbar.open(this.$t('substance.save.success.info'));
				}
				// this.$buefy.snackbar.open(this.$t('project.save.invalid.info'));
			} catch (ex) {
				console.error(ex);
				this.$buefy.snackbar.open(this.$t('substance.save.error.info'));
			} finally {
				this.substanceTypeLink = new SubstanceTypeLink();
				this.loading = false;
			}
		},

       changeData(ev)
	   {
		    console.log(event.target.value)
	   },

		onCancelSubstanceEdit() {
			this.cancelSubstanceEditAsync();
		},

		async cancelSubstanceEditAsync() {
			this.isLoading = true;

			try {
				this.substance = await this.getSubstanceService.getAsync(this.substance.id);
				this.isEditMode = false;
			} catch (ex) {
				console.error(ex);
			} finally {
				this.isLoading = false;
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
</style>
