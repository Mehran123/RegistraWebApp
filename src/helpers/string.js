import { includes, toLower, toString } from 'lodash';

export const isSubStringExist = (str1, str2) => {
	return includes(toLower(toString(str1)), toLower(str2));
};
