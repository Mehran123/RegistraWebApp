
export const Permission = {
	AdminProject: "admin projects",
	Developer: "developer"
}

export class Claim {
	type;
	value;

	constructor() {
		this.type = "";
		this.value = "";
	}
}