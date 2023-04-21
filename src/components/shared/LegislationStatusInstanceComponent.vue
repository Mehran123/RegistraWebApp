<template>
	<span>
		{{ displayValue }}
		<span class="tags" v-if="hasFlags">
			<span class="tag" v-for="flag in value.flags">{{ flag }}</span>
		</span>
	</span>
</template>

<script>
import { format, parseJSON } from 'date-fns'
import { isDate, isNil, isString, trim } from 'lodash'


export default {
	props: {
		value: {
			type: Object,
			default: () => { }
		},
		item: {
			type: Object
		},
		isEdit: {
			type: Boolean,
			default: false
		},
		referenceId: {
			type: String,
			default: ''
		},
		extended: {
			type: Boolean,
			default: false
		},
		expiresOn: {

		},
		validOn: {

		}
	},

	computed: {
		hasFlags() {
			let result = (!isNil && Array.isArray(this.value?.flags) && this.value?.flags?.length > 0);
			return result;
		},

		displayValue() {
			let res = this.value?.legislationStatus?.name;
			let addons = [];
			let addon = '';

			// tonnage
			if(this.tonnageDisplayValue)
				addons.push(this.tonnageDisplayValue);

			// legal entity
			if(this.value?.legalEntity?.name)
				addons.push(this.value?.legalEntity?.name);

			// inactive
			if (this.extended && ! (this.value?.status?.isActive ?? false))
				addons.push('inactive');
				

			// concat addons
			if (addons.length > 0) {
				addon = addons.join(' | ');
				res = `${res} (${addon})`;
			}

			return res;
		},

		hasValidOn() {
			return !isNil(this.validOn) || !isNil(this.value?.validOn);
		},

		tonnageDisplayValue() {
			if (isNil(this.value) || !trim(this.value?.tonnageName))
				return '';

			return `${this.value?.tonnageName}` ?? '';
		},

		internalValidOn() {
			if (!isNil(this.validOn))
				return this.ensureDate(this.validOn);

			if (!isNil(this.value?.validOn))
				return this.ensureDate(this.value?.validOn);

			return null;
		},

		hasExpiresOn() {
			return !isNil(this.expiresOn) || !isNil(this.value?.expiresOn);
		},

		internalExpiresOn() {
			if (!isNil(this.expiresOn))
				return this.ensureDate(this.expiresOn);

			if (!isNil(this.value?.expiresOn))
				return this.ensureDate(this.value?.expiresOn);

			return null;
		},


	},

	methods: {
		ensureDate(value) {
			if (isNil(value))
				return null;


			if (isString(value)) {
				return parseJSON(value);
			}

			return value;
		}
	}
};
</script>

<style></style>
