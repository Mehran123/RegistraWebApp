<template>
	<div>
		<div>
			<button @click="addNote" class="button" v-if="isEdit && isNoteTypeIncluded">{{ $t('notes.addNote.label') }}</button>
			<button @click="addTask" class="button" v-if="isEdit && isTaskTypeIncluded">{{ $t('notes.addTask.label') }}</button>
			<button @click="toggleSort" class="button" v-if="hasItems">{{ $t('notes.sorting.' + sortType + '.label') }}</button>
		</div>
		<div class="column is-italic" v-if="!hasItems">
			<span v-if="!isTaskTypeIncluded && isNoteTypeIncluded">{{ $t('notes.noNotes.text') }}</span>
			<span v-if="isTaskTypeIncluded && !isNoteTypeIncluded">{{ $t('notes.noTasks.text') }}</span>
			<span v-if="isTaskTypeIncluded && isNoteTypeIncluded">{{ $t('notes.noNotesAndTasks.text') }}</span>
		</div>
		<div class="panel" v-if="hasItems">
			<template v-for="note in processedNotes">
				<a class="panel-block" @click="toggleNoteDetails(note)" :class="{'has-addon is-active': isNoteDetailsActive(note)}">
					<span class="panel-icon" :class="{'checkbox': isTaskType(note)}">
						<font-awesome-icon :icon="['fas', 'sticky-note']" v-if="isNoteType(note)"></font-awesome-icon>
						<font-awesome-icon :icon="['far', 'square']" v-if="isTaskType(note) && !note.isFinished && !isEdit"></font-awesome-icon>
						<font-awesome-icon :icon="['far', 'check-square']" v-if="isTaskType(note) && note.isFinished && !isEdit"></font-awesome-icon>
						<b-checkbox v-model="note.isFinished" v-if="isTaskType(note) && isEdit" @click.native.stop></b-checkbox>

					</span>
					<span v-if="!isEdit || !isNoteDetailsActive(note)">
						<span class="has-text-weight-semibold">{{ note.title }}</span>
						<div class="is-size-7">
							<span class="" v-if="note.dueAt">{{ formatDate(note.dueAt) }}</span>
							<span class="has-text-grey" v-if="note.updatedAt">[{{ formatDate(note.updatedAt) }}]</span>
						</div>
					</span>
					<input type="text" class="input has-text-weight-semibold" v-model="note.title" v-if="isEdit && isNoteDetailsActive(note)" @click.stop />

				</a>
				<a class="panel-block" v-show="isNoteDetailsActive(note)">
					<span class="panel-icon">
					</span>
					<span v-if="!isEdit">
						{{ note.content }}
					</span>
					<div v-if="isEdit" class="is-full-width">
						<div class="field" v-if="isTaskType(note)">
							<label class="label">{{ $t('note.dueAt.label') }}</label>
							<b-datepicker icon="calendar-alt"  :placeholder="countryFormat" v-model="note.dueAt" v-if="isEdit" :editable="isEdit" ></b-datepicker>
							<div v-if="!isEdit">
								{{ displayValue }}
							</div>
						</div>
						<div class="field" v-if="isTaskType(note)">
							<label class="label">{{ $t('note.remindAt.label') }}</label>
							<b-datepicker  icon="calendar-alt"  :placeholder="countryFormat" v-model="note.remindAt"  v-if="isEdit" :editable="isEdit"></b-datepicker>
							<div v-if="!isEdit">
								{{ displayValue }}
							</div>
						</div>
						<div class="field">
							<label class="label">{{ $t('note.isTask.label') }}</label>
							<b-switch :value="isTaskType(note)" @input="onNoteTypeChange(note, $event)"></b-switch>
						</div>
						<div class="field">
							<textarea v-model="note.content" v-if="isEdit" class="textarea"></textarea>
						</div>
						<div class="field">
							<button @click="deleteNote(note)" v-if="isEdit" class="button is-danger">{{ $t('note.delete.label') }}</button>
						</div>
					</div>

				</a>
			</template>
		</div>
	</div>
</template>

<script>
import { isArray, isString, sortBy, map, some } from 'lodash'
import { Note, NoteType, NoteCategory, cleanupNote, isCategoryMatch } from '../../models/Note'
import { format } from 'date-fns'

const SortType = {
	OldestFirst: 'oldestFirst',
	NewestFirst: 'newestFirst'
}

export default {
	props: {
		value: {
			type: Array,
			default: () => []
		},

		type: {
			default: 'all'
		},

		isEdit: {
			type: Boolean,
			default: false
		},

		hideMenuAdd: {
			type: Boolean,
			default: false
		},

		category: {
			type: String,
			default: NoteCategory.Default
		}
	},

	data() {
		return {
			internalNotes: this.value,
			openNotes: [],
			sortType: SortType.NewestFirst
		}
	},

	watch: {
		value: {
			handler: function (newValue) {
				if (isArray(newValue)) {
					this.internalNotes = map(newValue, cleanupNote);
				}
			},
			immediate: true
		}
	},

	computed: {
		displayValue() {
				return this.dateValue ? this.formatDate(this.value, this.dateFormat) : this.placeholder;
			},
		countryFormat() {
				var lang = navigator.language || navigator.userLanguage;
				const dtf = new Intl.DateTimeFormat(lang)
				return "Date format " + dtf.format(new Date(2000, 11, 25, 12))
			},
		hasItems() {
			return this.processedNotes.length > 0;
		},

		isTaskTypeIncluded() {
			return this.isTypeIncluded(NoteType.Task);
		},

		isNoteTypeIncluded() {
			return this.isTypeIncluded(NoteType.Note) || this.isTypeIncluded(NoteType.Default);
		},

		processedNotes() {
			if (!isArray(this.internalNotes))
				return [];

			let filteredNotes = this.internalNotes.filter(n => this.isNoteIncluded(n));

			return filteredNotes.sort((note1, note2) => {
				if (!note1.updatedAt || !(note1.updatedAt instanceof Date))
					return 1;
				if (!note2.updatedAt || !(note2.updatedAt instanceof Date))
					return -1;

				if (note1.updatedAt.getTime() == note2.updatedAt.getTime())
					return 0;

				if (this.sortType == SortType.NewestFirst) {
					return (note1.updatedAt.getTime() < note2.updatedAt.getTime()) ? 1 : -1;
				}

				if (this.sortType == SortType.OldestFirst) {
					return (note1.updatedAt.getTime() < note2.updatedAt.getTime()) ? -1 : 1;
				}
			})
		},
	},

	methods: {
		/**
		 * @param {String|Array<String>[]} noteType
		 * @return {Boolean}
		 */
		isTypeIncluded(noteType) {
			if (isArray(noteType)) {
				return some(noteType, this.isTypeIncluded(noteType));
			}

			if (isString(noteType))
				noteType = noteType.toLowerCase();

			if (!this.type || this.type === 'all' || (noteType && isString(this.type) && this.type.toLowerCase() === noteType))
				return true;

			if (isArray(this.type) && some(this.type, (t) => isString(t) && t.toLowerCase() == noteType))
				return true;

			return false;
		},

		isNoteIncluded(note) {
			return this.isTypeIncluded(note?.type) && isCategoryMatch(note, this.category);
		},

		formatDate(date) {
			return date ? format(new Date(date), 'dd-MM-yyyy')  : '—';
			// return date && date instanceof Date ? format(date, 'P') : '—';
		},

		isOfType(note, type) {
			return note && note.type && isString(note.type) && type && isString(type) && note.type.toLowerCase() == type.toLowerCase();
		},

		isTaskType(note) {
			return this.isOfType(note, NoteType.Task);
		},

		isNoteType(note) {
			return !this.isOfType(note, NoteType.Task);
		},

		isNoteDetailsActive(note) {
			if (!note || !isString(note.id))
				return false;

			if (!isArray(this.openNotes))
				return false;

			return this.openNotes.indexOf(note.id) > -1;
		},

		toggleNoteDetails(note) {
			if (!note || !isString(note.id))
				return;

			if (!isArray(this.openNotes))
				this.openNotes = [];

			var index = this.openNotes.indexOf(note.id);
			if (index > -1) {
				this.openNotes.splice(index, 1);
			}
			else {
				if (this.isEdit)
					this.openNotes = [];

				this.openNotes.push(note.id);
			}
		},

		onNoteTypeChange(note, value) {
			if (value)
				note.type = NoteType.Task;
			else
				note.type = NoteType.Note;
		},

		toggleSort() {
			this.sortType = (this.sortType == SortType.NewestFirst) ? SortType.OldestFirst : SortType.NewestFirst;
		},

		addNote() {
			if (!isArray(this.internalNotes))
				this.internalNotes = [];

			this.internalNotes.push(new Note(NoteType.Default, this.category));
			this.$emit('input', this.internalNotes);
		},

		addTask() {
			if (!isArray(this.internalNotes))
				this.internalNotes = [];
			const note = new Note(NoteType.Task, this.category);
			this.internalNotes.push(note);
			this.$emit('input', this.internalNotes);
		},

		deleteNote(note) {
			if (!confirm(this.$t('note.delete.confirmation', { 'title': note.title })))
				return;

			const index = this.internalNotes.indexOf(note);
			if (index > -1)
				this.internalNotes.splice(index, 1);
				this.$emit('arraychanged', this.internalNotes);
				// this.value = this.internalNotes;
		}
	}
}
</script>

<style>
a.panel-block.has-addon {
	border-bottom: 0 !important;
}
</style>