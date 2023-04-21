<template>
	<div class="columns">
		<div class="column is-4-tablet is-3-desktop is-2-fullhd">
			<div v-if="project">
				<div class="field">
					<label class="label">
						Archives Check Finished On
					</label>
					<data-field v-slot="props" reference-id="Project.DataGapsArchivesCheckFinishedAt" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<input-date-rw v-model="project.dataGapsArchivesCheckFinishedAt" :date-format="$t('format.shortDate')" :item="props.item" :is-edit="props.isEdit"></input-date-rw>
					</data-field>
				</div>

				<div class="field">
					<label class="label">
						Preliminary Analysis
					</label>
					<data-field reference-id="Project.DataGapsPreliminaryAnalysisPc" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsPreliminaryAnalysisPc" v-bind="props">{{ $t('project.dataGapsPreliminaryAnalysisPc.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
					<data-field reference-id="Project.DataGapsPreliminaryAnalysisTox" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsPreliminaryAnalysisTox" v-bind="props">{{ $t('project.dataGapsPreliminaryAnalysisTox.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
					<data-field reference-id="Project.DataGapsPreliminaryAnalysisEcoTox" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsPreliminaryAnalysisEcoTox" v-bind="props">{{ $t('project.dataGapsPreliminaryAnalysisEcoTox.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
					<data-field reference-id="Project.DataGapsPreliminaryAnalysisSpectraMethods" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsPreliminaryAnalysisSpectraMethods" v-bind="props">{{ $t('project.dataGapsPreliminaryAnalysisSpectraMethods.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
				</div>

				<div class="field">
					<label class="label">
						Thorough Analysis
					</label>
					<data-field reference-id="Project.DataGapsThoroughAnalysisPc" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsThoroughAnalysisPc" v-bind="props">{{ $t('project.dataGapsThoroughAnalysisPc.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
					<data-field reference-id="Project.DataGapsThoroughAnalysisTox" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsThoroughAnalysisTox" v-bind="props">{{ $t('project.dataGapsThoroughAnalysisTox.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
					<data-field reference-id="Project.dataGapsThoroughAnalysisEcoTox" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsThoroughAnalysisEcoTox" v-bind="props">{{ $t('project.dataGapsThoroughAnalysisEcoTox.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
					<data-field reference-id="Project.dataGapsThoroughAnalysisSpectraMethods" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
						<div class="field">
							<input-three-state-boolean-rw v-model="props.item.dataGapsThoroughAnalysisSpectraMethods" v-bind="props">{{ $t('project.dataGapsThoroughAnalysisSpectraMethods.label') }}</input-three-state-boolean-rw>
						</div>
					</data-field>
				</div>

				<div class="field">
					<label class="label is-text-right">
						Business Unit Questionary
					</label>
					<div class="field column">
						<label class="label">{{ $t('project.dataGapsBusinessUnitQuestionarySentAt.label') }}</label>
						<data-field v-slot="props" reference-id="Project.DataGapsBusinessUnitQuestionarySentAt" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
							<input-date-rw v-model="props.item.dataGapsBusinessUnitQuestionarySentAt" :date-format="$t('format.shortDate')" :item="project" :is-edit="isEditMode"></input-date-rw>
						</data-field>
					</div>
					<div class="field column">
						<label class="label">{{ $t('project.dataGapsBusinessUnitQuestionaryReviewedAt.label') }}</label>
						<data-field v-slot="props" reference-id="Project.DataGapsBusinessUnitQuestionaryReviewedAt" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
							<input-date-rw v-model="props.item.dataGapsBusinessUnitQuestionaryReviewedAt" :date-format="$t('format.shortDate')" :item="project" :is-edit="isEditMode"></input-date-rw>
						</data-field>
					</div>
				</div>
			</div>
		</div>
		<div class="column is-offset-1">
			<data-field v-slot="props" reference-id="Project.Notes" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
				<label class="label">{{ $t('project.notes.label') }}</label>
				<div class="field">
					<notes-tasks-rw v-model="props.item.notes" :item="props.item" :is-edit="props.isEdit" category="DataGaps" />
				</div>
			</data-field>
		</div>
	</div>

</template>

<script>
export default {
	props: {
		project: {
			type: Object,
			default: () => ({})
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

	computed: {
		noteTemplateInfo() {
			return {
				// dataGapsesId: this.project.dataGapses.id,
				projectId: null
			};
		}
	}
};
</script>

<style lang="scss" scoped></style>
