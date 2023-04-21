<template>
	<div v-if="project">
		<data-field reference-id="Project.StartAt" v-slot="props" v-bind="defaultDataFieldProperties">
			<div class="field">
				<label class="label">Project Start on</label>
				<input-date-rw v-model="props.item.startAt" v-bind="props"></input-date-rw>
			</div>
		</data-field>

		<data-field reference-id="Project.Deadline" v-slot="props" v-bind="defaultDataFieldProperties">
			<div class="field">
				<label class="label">{{ $t('project.deadline.label') }}</label>
				<input-date-rw v-model="props.item.deadline" v-bind="props"></input-date-rw>
			</div>
		</data-field>


		<table class="table">
			<thead>
				<tr>
					<th v-show="!isEditMode"></th>
					<th>Phase</th>
					<th v-show="isEditMode">Active</th>
					<th v-show="isEditMode">Finished</th>
					<th>Duration in Business Days</th>
					<th>Phase Complete on</th>
					<td></td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="phaseData in sortedPhaseData" :key="phaseData.id" v-show="isEditMode || phaseData.isActive">
					<td v-show="!isEditMode"><font-awesome-icon :icon="['fas', 'check']" v-if="phaseData.isFinished"></font-awesome-icon></td>
					<td>{{ getNameForPhaseData(phaseData) }}</td>
					<td v-show="isEditMode">
						<b-checkbox v-model="phaseData.isActive"></b-checkbox>
					</td>
					<td v-show="isEditMode">
						<b-checkbox v-model="phaseData.isFinished"></b-checkbox>
					</td>
					<td>
						<editable :is-edit="isEditMode" :display-value="phaseData.durationInDays">
							<input type="number" class="input" step="1" min="0" v-model="phaseData.durationInDays" />
						</editable>
					</td>
					<td>
						<editable :is-edit="isEditMode" :display-value="formatDate(calcPhaseEndDate(phaseData), 'P')">
							<b-datepicker :value="calcPhaseEndDate(phaseData)" @input="changePhaseDate($event, phaseData)"></b-datepicker>
						</editable>
					</td>
					<td>
						<div class="tags">
							<span class="tag is-danger" v-show="hasDeadlineWarning(phaseData)">Doesn't match the deadline</span>
							<span class="tag is-warning" v-show="isOverdue(phaseData)">Is overdue</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import { PhaseData } from '../../models/PhaseData';
	import { isDate, differenceInBusinessDays, addBusinessDays, isPast, format } from 'date-fns';
	import { isObject } from 'lodash';

	export default {
		props: {
			project: {
				type: Object,
				default: () => {}
			},

			showDeveloperInformation: {
				type: Boolean,
				defaut: false
			},

			defaultNoValueDisplayValue: {
				type: String
			},

			isEditMode: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				phases: []
			};
		},

		dependencies: ['getPhasesService'],

		computed: {
			defaultDataFieldProperties() {
				return {
					showDeveloperInformation: this.showDeveloperInformation,
					isEdit: this.isEditMode,
					item: this.project,
					noValueDisplayValue: this.defaultNoValueDisplayValue
				}
			},

			sortedPhaseData() {
				if (!this.project) return [];

				let sortedPhases = this.projectPhaseData.slice();
				sortedPhases.sort((a, b) => {
					const aPhaseOrder = this.getOrderForPhaseData(a);
					const bPhaseOrder = this.getOrderForPhaseData(b);
					if (aPhaseOrder < bPhaseOrder) return -1;

					if (aPhaseOrder > bPhaseOrder) return 1;

					return 0;
				});

				return sortedPhases;
			},

			startDate() {
				if (this.project && this.project.startAt) return this.project.startAt;

				return new Date();
			},

			projectPhaseData() {
				if (!this.project) return [];

				if (!Array.isArray(this.project.phases)) this.$set(this.project, 'phases', []);

				for (const phase of this.phases) {
					let phaseData = this.project.phases.find(e => e.phaseId === phase.id);
					if (!phaseData) {
						phaseData = new PhaseData();
						phaseData.projectId = this.project.id;
						phaseData.phaseId = phase.id;
						phaseData.isActive = true;
						phaseData.isFinished = false;
						this.project.phases.push(phaseData);
					}
				}

				return this.project.phases;
			}
		},

		methods: {
			/**
			 * @param {PhaseData} phaseData
			 */
			calcPhaseEndDate(phaseData) {
				const sumOfDays = this.sumOfDays(phaseData, true);
				let result = addBusinessDays(this.startDate, sumOfDays);
				return result;
			},

			formatDate(date) {
 			return date ? format(new Date(date), 'dd-MM-yyyy')  : '—';
			},

			hasDeadlineWarning(phaseData) {
				if (!isObject(phaseData) || !phaseData.isActive || phaseData.isFinished || !isObject(this.project) || !isDate(this.project.deadline)) return false;

				const phase = this.getPhaseForPhaseData(phaseData);
				if (!phase || !phase.needsToBeByTheDeadline) return false;

				if (addBusinessDays(this.startDate, this.sumOfDays(phaseData)) > this.project.deadline) return true;

				return false;
			},

			isOverdue(phaseData) {
				if (!isObject(phaseData) || !phaseData.isActive || phaseData.isFinished || phaseData.durationInDays == 0) return false;

				if (isPast(addBusinessDays(this.startDate, this.sumOfDays(phaseData)))) return true;

				return false;
			},

			sumOfDays(phaseData, includeSelf = true) {
				const phaseOrder = this.getOrderForPhaseData(phaseData);

				return this.sortedPhaseData.reduce((accumulator, currentPhaseData) => {
					const currentPhaseDataOrder = this.getOrderForPhaseData(currentPhaseData);
					if (!currentPhaseData.isActive) return accumulator;

					if ((includeSelf && currentPhaseDataOrder <= phaseOrder) || (!includeSelf && currentPhaseDataOrder < phaseOrder)) return accumulator + parseInt(currentPhaseData.durationInDays);

					return accumulator;
				}, 0);
			},

			/**
			 * @param {PhaseData} phaseData
			 */
			getPhaseForPhaseData(phaseData) {
				return this.phases.find(e => e.id == phaseData.phaseId);
			},

			/**
			 * @param {PhaseData} phaseData
			 */
			getOrderForPhaseData(phaseData) {
				const phase = this.getPhaseForPhaseData(phaseData);
				if (!phase) return 999;

				return phase.order;
			},

			/**
			 * @param {PhaseData} phaseData
			 */
			getNameForPhaseData(phaseData) {
				const phase = this.getPhaseForPhaseData(phaseData);
				if (!phase) return 'Unknown Phase';

				return phase.name;
			},

			/**
			 * @param {Date} newDate
			 * @param {PhaseData} phaseData
			 */
			changePhaseDate(newDate, phaseData) {
				const phaseDataIndex = this.sortedPhaseData.indexOf(phaseData);
				let durationInDays = differenceInBusinessDays(newDate, this.startDate);
				if (phaseDataIndex > 0) durationInDays -= this.sumOfDays(phaseData, false);

				phaseData.durationInDays = durationInDays;
			}
		},

		created() {
			// areas
			this.getPhasesService.getAsync().then(phases => {
				this.phases = phases;
			});
		}
	};
</script>

<style></style>
