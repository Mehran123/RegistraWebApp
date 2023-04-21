import * as rules from 'vee-validate/dist/rules';

const customMessages = {
	required: 'This field is required',
	numeric: 'This field may only contains numeric characters'
};

export default extend => {
	// Pre-populate all rules
	Object.keys(rules).forEach(rule => {
		extend(rule, {
			...rules[rule],
			message: customMessages[rule] || rules[rule].message
		});
	});
};
