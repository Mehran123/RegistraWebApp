import { v4 as uuid } from 'uuid'

export class Area {
	id;
	name;
	code;

	constructor() {
		this.id = uuid();
		this.name = '';
		this.code = '';
	}
}