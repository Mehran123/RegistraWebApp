<template>
	<div>
		<div class="columns">
			<div class="column is-narrow">
				<!-- <input-with-validation v-model="project.authorityReference" type="text" name="authorityReference" :label="" :is-edit="isEditMode" /> -->
				<data-field reference-id="Project.AuthorityReference" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.authorityReference.label') }}</label>
					<input-rw v-model="props.item.authorityReference" v-bind="props"></input-rw>
				</data-field>

				<data-field reference-id="Project.AuthorityDemands" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.authorityDemands.label') }}</label>
					<input-rw type="textarea" v-model="props.item.authorityDemands" v-bind="props"></input-rw>
				</data-field>

				<!-- <input-with-validation v-model="project.registrationNumber" type="text" :label="$t('project.registrationNumber.label')" name="registrationNumber" :is-edit="isEditMode" /> -->
				<data-field reference-id="Project.RegistrationNumber" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.registrationNumber.label') }}</label>
					<input-rw v-model="props.item.registrationNumber" v-bind="props"></input-rw>
				</data-field>

				<data-field reference-id="Project.Legislation.Authority.Name" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('authority.name.label') }}</label>
					{{ project && props.item.legislation && props.item.legislation.authority && props.item.legislation.authority.name ? props.item.legislation.authority.name : defaultNoValueDisplayValue }}
				</data-field>
				
				<data-field reference-id="Project.RegistrationAtAuthorityOn" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.RegistrationAtAuthorityOn.label') }}</label>
					<input-date-rw v-model="props.item.registrationAtAuthorityOn" v-bind="props"></input-date-rw>
				</data-field>

				<!-- <input-with-validation v-model="jointSubmissionName" inputType="autocomplete" name="joinsubmission-name" :label="$t('project.authority.jointSubmissionName')" type="text" field="name" :data="filteredJointSubmissionNames" :is-edit="isEditMode" /> -->
				<data-field reference-id="Project.JointSubmissionName" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.jointSubmissionName.label') }}</label>
					<input-rw v-model="props.item.jointSubmissionName" v-bind="props"></input-rw>
				</data-field>

				<!-- <input-with-validation v-model="project.submissionReferenceId" type="text" name="submission-No" :label="$t('project.authority.submissionReferenceId')" :is-edit="isEditMode" /> -->
				<data-field reference-id="Project.SubmissionReferenceId" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.submissionReferenceId.label') }}</label>
					<input-rw v-model="props.item.submissionReferenceId" v-bind="props"></input-rw>
				</data-field>

				<data-field reference-id="Project.RegistrationName" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.registrationName.label') }}</label>
					<input-rw v-model="props.item.registrationName" v-bind="props"></input-rw>
				</data-field>

				<data-field reference-id="Project.RegistrationValidUntil" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.registrationValidUntil.label') }}</label>
					<input-date-rw v-model="props.item.registrationValidUntil" v-bind="props" ></input-date-rw>
				</data-field>
				<!-- <data-field reference-id="Project.Legislation" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.legislation.label')">
						<legislation v-model="props.item.legislation" :reference-value.sync="props.item.legislationId" v-bind="props" :value-set="legislationValueSet"></legislation>
					</field>
				</data-field> -->
				<data-field reference-id="Project.Legislation" v-slot="props" v-bind="defaultDataFieldProperties">
					<field :label.once="$t('project.legislation.label')">
						<legislation v-model="props.item.legislation" v-bind="props"  :is-edit="false"></legislation>
					</field>
				</data-field>
			</div>

			<div class="column is-offset-1">
				<data-field v-slot="props" reference-id="Project.Notes" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.notes.label') }}</label>
					<div class="field">
						<notes-tasks-rw v-model="props.item.notes" :item="props.item" v-bind="props"		 category="Authority" />
					</div>
				</data-field>

				<data-field reference-id="Project.Attachments" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.attachments.authorityGeneral.label')}}</label>
					<attachment-table-rw v-model="props.item.attachments" type="authority.general"  v-bind="props" :project-id="props.item.id"></attachment-table-rw>
				</data-field>

				<data-field reference-id="Project.Attachments" v-slot="props" v-bind="defaultDataFieldProperties">
					<label class="label">{{ $t('project.attachments.authorityWorkflow.label')}}</label>
					<attachment-table-rw v-model="props.item.attachments" type="authority.workflow"  v-bind="props" :attributes="['submissionId', 'reason']" :project-id="props.item.id" :tags-value-set="tags"></attachment-table-rw>
				</data-field>
			</div>
		</div>
	</div>
</template>

<script>
	// import AuthorityDocuments from './AuthorityDocuments.vue';
	import { isSubStringExist } from '../../helpers/string'
	import { isArray } from 'lodash'

	export default {
		// components: {
		// 	AuthorityDocuments
		// },

		props: {
			showDeveloperInformation: {
				type: Boolean,
				default: false
			},

			
			isEditMode: {
				type: Boolean,
				default: false
			},

			project: {
				type: Object,
				default: () => ({})
			},
			
			legislations: {
				type: Array,
				default: () => []
			},
			defaultNoValueDisplayValue: {
				type: String
			},
		},

		dependencies: ['getJointSubmissionNamesService', 'getTagsService'],

		data() {
			return {
				authority: [],
				jointSubmissionName: '',
				jointSubmissionNames: [],
				pendingAttachments: 0,
				tags: []
			};
		},

		async created() {
			try {
				this.jointSubmissionName = this.project.jointSubmissionName;
				this.jointSubmissionNames = await this.getJointSubmissionNamesService.getAsync();
				this.tags = await this.getTagsService.getAsync();
			} catch (ex) {
				console.error(ex);
			}
		},

		watch: {
			jointSubmissionName: {
				handler(newValue) {
					this.project.jointSubmissionName = newValue;
				}
			}
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
			// legislationValueSet() {
			// 	return toValueSet(this.legislations);
			// },
			filteredJointSubmissionNames() {
				return this.jointSubmissionNames.filter(name => isSubStringExist(name, this.jointSubmissionName));
			}
		},

		methods:{
			
		}
	};
</script>


