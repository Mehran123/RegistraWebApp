import { filter, map, toString } from 'lodash';

export function filterByIndex(array, i) {
	const removePredicateByIndex = (predicate, index) => index !== i;
	return filter(array, removePredicateByIndex);
}

export function filterById(array, id) {
	const removePredicateByIndex = item => item.id !== id;
	return filter(array, removePredicateByIndex);
}

export function transformSearchParamsQuery(params) {
	return map(params, ({ key, value }) => ({ key, value: toString(value) }));
}

export function transformFilterParamsToQuery(params) {
	return map(params, ({ key, value }) => ({
		key,
		value: toString(value),
		isFilter: true
	}));
}
