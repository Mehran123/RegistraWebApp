<template>
	<div >
		<div class="columns">
			<div class="column is-4-tablet">
				<!-- <input-with-validation v-model="consortiumTemplate.name" inputType="autocomplete" type="text" label="Consortium name" name="consortium-name" field="name" :data="filteredConsortiums(consortiumTemplate.name)" :is-edit="isEditMode" @select="selectConsortium" /> -->
				<data-field reference-id="Project.Consortium" v-slot="props" v-bind="defaultDataFieldProperties">
					<div class="field" v-if="props.isEdit">
						<div class="label">Consortium</div>
						<div class="control">
							<div class="field has-addons">
								<div class="control is-expanded">
									<select-rw :is-search="true" v-model="project.consortium" :reference-value="project.consortiumId" :is-edit="props.isEdit" :value-set="consortiumValueSet"></select-rw>
								</div>
								<div class="control">
									<button class="button" @click="createNewConsortium">
										<font-awesome-icon :icon="['fas', 'plus']" class="mr-2"></font-awesome-icon>
										{{ $t('addConsortium.label') }}
									</button>
								</div>
							</div>
						</div>
					</div>
				</data-field>
			<div v-if="project.consortium">
				<data-field  reference-id="Project.Consortium.Name" v-slot="props" v-bind="defaultDataFieldProperties">
					<div class="field">
						<label class="label">Name</label>
						<input type="text" class="input" v-model="project.consortium.name" v-if="props.isEdit" />
						<div v-if="!props.isEdit">{{ project.consortium.name || defaultNoValueDisplayValue }}</div>
					</div>
				</data-field>

				<data-field reference-id="Project.Consortium.TechnicalConsultant" v-slot="props" v-bind="defaultDataFieldProperties">
					<div class="label">Technical Consultant</div>
					<contact v-bind="props" :contacts="contacts" :areas="areas" v-model="props.item.consortium.technicalConsultant" :reference-value="project.consortium.technicalConsultantContactId" @create="onContactCreated" />
				</data-field>

				<data-field reference-id="Project.Consortium.Manager" v-slot="props" v-bind="defaultDataFieldProperties">
					<div class="label">Manager</div>
					<contact v-bind="props" :contacts="contacts" :areas="areas" v-model="props.item.consortium.manager" :reference-value="project.consortium.managementContactId" @create="onContactCreated" />
				</data-field>

				<data-field reference-id="Project.Consortium.Lead" v-slot="props" v-bind="defaultDataFieldProperties">
					<div class="label">Lead Company</div>
					<contact v-bind="props" type="company" :contacts="contacts" :areas="areas"  v-model="props.item.consortium.lead" :reference-value="project.consortium.leadContactId" @create="onContactCreated" />
				</data-field>


				<data-field reference-id="Project.Consortium.FinancialConsultant" v-slot="props" v-bind="defaultDataFieldProperties">
					<div class="label">Financial Consultant</div>
					<contact v-bind="props" :contacts="contacts" :areas="areas"  v-model="props.item.consortium.financialConsultant" :reference-value="project.consortium.financialConsultantContactId" @create="onContactCreated" />
				</data-field>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { keyBy } from 'lodash';
	import { isSubStringExist } from '../../helpers/string.js';
	import { ValueSetList } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
	import { toValueSet } from 'lanxess-frontend/vuejs/ValueSet'
	import { Consortium } from '../../models/Consortium'

	export default {
		dependencies: ['getAreasService', 'getConsortiumsService', 'getContactsService'],

		props: {
			showDeveloperInformation: {
				type: Boolean,
				default: false
			},

			defaultNoValueDisplayValue: {
				type: String
			},

			isEditMode: {
				type: Boolean,
				default: false
			},

			project: {
				type: Object
			}
		},

		data() {
			return {
				areas: [],
				contacts: [],
				consortiums: [],
				contactsMap: {}
			};
		},

		computed: {
			defaultDataFieldProperties() {
				return {
					showDeveloperInformation: this.showDeveloperInformation,
					isEdit: this.isEditMode,
					item: this.project,
					noValueDisplayValue: this.defaultNoValueDisplayValue
				}
			},

			consortiumValueSet() {
				return toValueSet(this.consortiums);
			}
		},

		watch: {
			'consortiumTemplate.name': {
				handler(newValue) {
					this.project.consortium.name = newValue || this.project.consortium.name;
				}
			}
		},

		async created() {
			try {
				this.areas = await this.getAreasService.getAsync();
				this.consortiums = await this.getConsortiumsService.getAsync();
				this.contacts = await this.getContactsService.getAsync();
				this.contactsMap = keyBy(this.contacts, 'id');
			} catch (ex) {
				console.error(ex);
			}
		},

		methods: {
			filteredConsortiums(name = '') {
				return this.consortiums.filter(consortium => {
					return isSubStringExist(consortium.name, name);
				});
			},

			createNewConsortium() {
				const consortium =new Consortium();
				consortium.name = "New Consortium";
				this.project.consortium = consortium;
				this.project.consortiumId = this.project.consortium.id;
				this.consortiums.push(this.project.consortium);
			},

			onContactCreated(contact) {
				this.contacts.push(contact);
			}
		}
	};
</script>

<style lang="scss" scoped></style>
