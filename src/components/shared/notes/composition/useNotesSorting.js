import { computed, reactive } from '@vue/composition-api';
import { filter } from 'lodash';
import moment from 'moment';

export const useNotesSorting = (props, { root }) => {
	const filterStates = reactive({
		notesFiltered: false,
		tasksFiltered: false
	});

	const toggleNotesFiltered = () => {
		filterStates.notesFiltered = !filterStates.notesFiltered;
	};

	const toggleTasksFiltered = () => {
		filterStates.tasksFiltered = !filterStates.tasksFiltered;
	};

	const filteringNoteLabel = computed(() => {
		return filterStates.notesFiltered ? 'Newest First' : 'Oldest First';
	});

	const filteringTasksLabel = computed(() => {
		return filterStates.tasksFiltered ? 'Newest First' : 'Oldest First';
	});

	const sorting = (isFiltered, list) => {
		let sorted = [];

		if (props.isEdit) {
			sorted = list;
		} else {
			sorted = list.sort((a, b) => {
				a = moment(a.createdAt).unix();
				b = moment(b.createdAt).unix();
				return isFiltered ? a - b : b - a;
			});
		}

		return sorted;
	};

	const allNotesList = computed(() => {
		return sorting(filterStates.notesFiltered, props.notes);
	});

	const emptyNotesLabel = computed(() => {
		return !allNotesList.value.length && root.$i18n.t('project.notes.empty');
	});

	const notesList = computed(() => {
		const filtered = filter(props.notes, ['type', 'Default']);

		return sorting(filterStates.notesFiltered, filtered);
	});

	const notesLabel = computed(() => {
		return notesList.value.length ? root.$i18n.t('project.notes.label') : root.$i18n.t('project.notes.empty');
	});

	const tasksList = computed(() => {
		const filtered = filter(props.notes, ['type', 'Task']);

		return sorting(filterStates.tasksFiltered, filtered);
	});

	const tasksLabel = computed(() => {
		return tasksList.value.length ? root.$i18n.t('project.tasks.label') : root.$i18n.t('project.tasks.empty');
	});

	return {
		filteringNoteLabel,
		filteringTasksLabel,
		allNotesList,
		emptyNotesLabel,
		notesList,
		notesLabel,
		tasksList,
		tasksLabel,
		toggleNotesFiltered,
		toggleTasksFiltered
	};
};
