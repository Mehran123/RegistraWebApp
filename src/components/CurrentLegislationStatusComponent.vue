<template>
	<div>
		<ul style="list-style-type: disc" class="ml-4" v-if="values && values.length > 1">
			<li v-for="item in values">
				{{ currentLegislationStatusDisplayname(item)}}
				{{ item.legislationStatus.name }}
				{{ tonnageDisplayValue(item) }}
				{{ expiryDisplayValue(item) }}
				<span class="tag" v-for="flag in item.flags">{{ flag }}</span>
			</li>
		</ul>
		<span v-if="values && values.length == 1">{{ currentLegislationStatusDisplayname(values[0])}} {{ values[0].legislationStatus.name }}{{ tonnageDisplayValue(values[0]) }}{{ expiryDisplayValue(values[0]) }}</span>		
		<span class="tag" v-for="flag in item.flags">{{ flag }}</span>
	</div>
</template>

<script>
import { get, isArray, sortBy, isNil, trim } from 'lodash'
import { format } from 'date-fns';

export default {
	props: {
		item: {
			type: Object,
			default: () => null
		},

		showExpiry: {
			type: Boolean,
			default: true
		}
	},

	dependencies: ['legislationStatusHelperService'],

	computed: {
		areaId() {
			return get(this.item, 'areaId', null);
		},

		legalEntityId() {
			return get(this.item, 'legalEntityId', null);
		},

		legislationId() {
			return get(this.item, 'legislationId', null);
		},

		values() {
			if (!this.item || !this.legalEntityId || !this.legislationId)
			// if (!this.item ||  !this.legislationId)
				return [];

			const legislationStatus = get(this.item, 'substance.legislationStatus');
			if (!isArray(legislationStatus) || legislationStatus.length < 1)
				return [];


			const relevantLegislationStatus = legislationStatus.filter((item) => {
				if (get(item, 'legislationStatus.legislation.areaId', null) === this.areaId
					&& get(item, 'legalEntityId', null) === this.legalEntityId
					// && get(item, 'status.isActive', true)
					)
					return true;

				return false;
			});

			return sortBy(relevantLegislationStatus, e => e.legislationStatus.name);
		}
	},

	methods: {
		tonnageDisplayValue(legislationStatusInstance) {
			if (isNil(legislationStatusInstance == null) || !trim(legislationStatusInstance?.tonnageName))
				return '';

			return ` (${legislationStatusInstance.tonnageName})` ?? '';
		},
		currentLegislationStatusDisplayname(legislationStatus){
				return ` (${legislationStatus.status.name})` ?? '';
		},
		expiryDisplayValue(legislationStatusInstance) {
			if (!this.showExpiry || isNil(legislationStatusInstance == null) || !legislationStatusInstance?.ExpiresOn)
				return '';

			return ` [expires ${format(new Date(legislationStatusInstance?.ExpiresOn), this.$t('format.shortDate'))}`;
		}
	}
}
</script>

<style>
</style>