import { v4 as uuid } from 'uuid';
//UTC
export const getNoteTemplate = ({ projectId, templateInfo }) => {
	const timeNow = new Date();

	return {
		id: uuid(),
		title: 'Note',
		type: 'Task',
		content: '',
		updatedAt: timeNow,
		createdAt: timeNow,
		projectId,
		...templateInfo
	};
};
