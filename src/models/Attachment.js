import { v4 as uuid } from 'uuid';

export class AttachmentContent {
	id;
	content;

	constructor() {
		this.id = uuid();
		this.content = '';
	}
}

export class Attachment {
	id;
	name;
	projectId;
	remindAt;
	mimeType;
	type;
	attributes;
	/** @type {AttachmentContent} */
	content;

	constructor() {
		this.id = uuid();
		this.name = '';
		this.mimeType = '';
		this.type = '';
		this.attributes = {};
		this.remindAt = null;
		this.content = null; 
	}
}

/**
 * 
 * @param {File} file 
 * @returns {Attachment}
 */
export function toAttachmentAsync(file, type, projectId) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const att = new Attachment();
			att.name = file.name;
			att.type = type;
			att.projectId = projectId;
			att.content = new AttachmentContent();
			att.content.content = reader.result.substr(reader.result.indexOf(',') + 1);
			att.mimeType = file.type;
			resolve(att);
		}
		reader.onerror = error => reject(error);
	});
}