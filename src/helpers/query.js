import { chain } from 'lodash';
import queryString from 'query-string';

export function transformParamsToQueryStr(params) {
	return chain(params)
		.map(({ key, value }) => `${key}=${value}`)
		.join('&')
		.value();
}

export function transformQueryStrToParams(search) {
	return chain(queryString.parse(search))
		.toPairs()
		.map(pair => ({
			key: pair[0],
			value: pair[1]
		}));
}

export function transformFiltersToParams(filters) {
	return chain(filters)
		.filter(({ checked }) => checked)
		.map(({ title, key }) => ({
			value: title,
			key,
			isFilter: true
		}))
		.value();
}
