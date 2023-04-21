import { findIndex } from 'lodash';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ref } from '@vue/composition-api';

const getNoteTemplate = ({ projectId, templateInfo }) => {
	const timeNow = moment(new Date()).format();

	return {
		id: uuid(),
		title: '',
		type: 'Task',
		content: '',
		updatedAt: timeNow,
		createdAt: timeNow,
		projectId,
		...templateInfo
	};
};

export const useNotesActions = props => {
	let openedIndex = ref(props.defaultOpenedIndex);

	const resetOpenIndex = index => {
		if (index === openedIndex.value) {
			openedIndex.value = -1;
		}
	};

	const deleteNote = id => {
		const index = findIndex(props.notes, ['id', id]);
		resetOpenIndex(index);
		props.notes.splice(index, 1);
	};

	const addNote = () => {
		props.notes.push(
			getNoteTemplate({
				projectId: props.item.id,
				templateInfo: props.templateInfo
			})
		);
		openedIndex.value = props.notes.length - 1;
	};

	return {
		deleteNote,
		addNote,
		openedIndex
	};
};
