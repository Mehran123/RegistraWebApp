<template>
	<view-wrapper>
		<!-- <data-field reference-id="LegalStatus.Identifiers" v-slot="props" :item="project" :is-edit="isEditMode" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('project.identifiers.label') }}</label>
				<input-identifiers-rw v-model="props.item.identifiers" v-bind="props" :predefined-keys="identifierKeys"></input-identifiers-rw>
			</div>
		</data-field> -->
		<div class="block">
		<button @click="isEditMode = true" v-show="!isEditMode" class="button rounded is-primary is-rounded is-outlined"><font-awesome-icon :icon="['fas', 'pen']" class="mr-1"></font-awesome-icon>{{ $t('edit') }}</button>
		<button @click="saveAsync" v-show="isEditMode" class="button rounded is-primary is-rounded is-outlined">{{ $t('save') }}</button>
		<button @click="cancelAsync" v-show="isEditMode" class="button rounded is-rounded is-outlined">{{ $t('cancel') }}</button>

		
		</div>

		<data-field reference-id="LegalStatus.Id" v-slot="props" :item="legalStatusInstance" :show-developer-information="showDeveloperInformation" v-if="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.id') }}</label>
				<div>{{$get(props.item, 'id', defaultNoValueDisplayValue)}}</div>
			</div>
		</data-field>

		<data-field reference-id="LegalStatus.Identifiers" v-slot="props" v-bind="defaultDataFieldProperties"  :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.legalEntity') }}</label>
				<select-rw v-model="props.item.legalEntity" :reference-value.sync="props.item.legalEntityId" v-bind="props" :value-set="legalEntityValueSet" :is-edit="false" ></select-rw>
			</div>
		</data-field>
		<data-field reference-id="LegalStatus.Identifiers" v-slot="props" v-bind="defaultDataFieldProperties"  :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.representative') }}</label>
				<select-rw v-model="props.item.representative" :reference-value.sync="props.item.representativeId" v-bind="props" :value-set="legalEntityValueSet" :is-edit="false" ></select-rw>
			</div>
		</data-field>

		<data-field reference-id="LegalStatus.Substance" v-slot="props" :is-edit="isEditMode" :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.substance') }}</label>
				<div>{{$get(props.item, 'substance.name', defaultNoValueDisplayValue)}}</div>
			</div>
		</data-field>

		<data-field reference-id="LegalStatus.Status" v-slot="props"  :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.status') }}</label>
				<select-rw v-model="props.item.status" :reference-value.sync="props.item.statusId" v-bind="props" :value-set="instanceStatusValueSet" :is-edit="isEditMode"></select-rw>
			</div>
		</data-field>

		<data-field reference-id="LegalStatus.Legislation" v-slot="props"  :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.legislation') }}</label>
				<input-rw v-model="props.item.legislationStatus.legislation.name" v-bind="props" :is-edit="false"></input-rw>
			</div>
		</data-field>
		<data-field reference-id="LegalStatus.legislationStatus" v-slot="props"  :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.title') }}</label>
				<input-rw v-model="props.item.legislationStatus.name" v-bind="props" :is-edit="false"></input-rw>
			</div>
		</data-field>
		
		<data-field reference-id="LegalStatus.Tonnage" v-slot="props"  :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.tonnage') }}</label>
				<!-- <input-rw v-model="props.item.tonnageName" v-bind="props" :is-edit="isEditMode"></input-rw> -->
				<input-rw v-model="props.item.tonnageName" v-bind="props" :is-edit="false"></input-rw>
			</div>
		</data-field>

		<data-field reference-id="LegalStatus.ExpiresOn" v-slot="props" :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.expiresOn') }}</label>
				<input-date-rw v-model="props.item.expiresOn" :date-format="$t('format.shortDate')"  v-bind="props" :is-edit="false" ></input-date-rw>
			</div>
		</data-field>

		<data-field reference-id="LegalStatus.RegistrationNumber" v-slot="props"  :item="legalStatusInstance" :show-developer-information="showDeveloperInformation">
			<div class="field">
				<label class="label">{{ $t('legalStatus.registrationNumber') }}</label>
				<input-rw v-model="props.item.registrationNumber" v-bind="props" :is-edit="false"></input-rw>
			</div>
		</data-field>
	</view-wrapper>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { cloneDeep, isEmpty, find, map, size, isArray } from 'lodash';
import AsyncDataTableComponent from 'lanxess-frontend/vuejs/components/async-data-table/AsyncDataTableComponent.vue';
import { DataQuerySearchFilter } from 'lanxess-frontend/vuejs/components/async-data-table/DataQuery';
// import { Column, ValueSetItem, applyValueSet, DataType } from 'lanxess-frontend/vuejs/components/async-data-table/Column';
// import { Columns, defaultView } from '../helpers/columns';
import { columnsToOdataQuery, createOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/OdataQuery';
import { toOdataQuery as searchToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/SearchFilter.vue';
import { toOdataQuery as valueSetToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/ValueSetFilter.vue';
import { toOdataQuery as dateRangeToOdataQuery } from 'lanxess-frontend/vuejs/components/async-data-table/filters/DateRangeFilterComponent.vue';
import { Permission } from '../models/Claim'
import { statuses } from '../helpers/constants';
import saveState from 'vue-save-state-session';

import { ValueSetItem, getOrderedValueSet, toValueSet } from 'lanxess-frontend/vuejs/components/async-data-table/Column';

// import { Column, View, ViewColumn, ColumnBaseType, DataType, ValueSetItem } from 'lanxess-frontend/vuejs/components/async-data-table/Column'






export default {
	props: {
		showDeveloperInformation: {
			type: Boolean,
			default: false
		},

		defaultNoValueDisplayValue: {
			type: String,
			default: '-'
		}
	},

	dependencies: [
		'getLegalStatusInstanceService',
		'getAllLegalStatusInstanceStatusService',
		'getLegalEntitiesService',
		'saveLegislationStatusInstanceService'
	],

	data() {
		return {
			legalStatusInstance: {},
			isBusy: true,
			instanceStatusValueSet: [],
			legalEntityValueSet: [],
			isEditMode: false
		}
	},

	async created() {
		this.isEditMode = !!this.$route.query.isEdit;

		try {
			let p = [];
			// p.push(this.getIdentifiersService.getAsync().then((v) => this.identifierKeys = v));
			// p.push(this.getDossierQualitiesService.getAsync().then((v) => this.dossierQualities = v));
			// p.push(this.getSubstanceService.getAsync(this.$route.params.id).then((v) => this.substance = v));
			p.push(this.getLegalEntitiesService.getAsync().then((v) => this.legalEntityValueSet = toValueSet(v)));
			p.push(this.getAllLegalStatusInstanceStatusService.getAsync().then((v) => this.instanceStatusValueSet = toValueSet(v)));
			p.push(this.getLegalStatusInstanceService.getAsync(this.$route.params.id).then((v) => this.legalStatusInstance = v));
			await Promise.all(p);
		} catch (ex) {
			console.error(ex);
		} finally {
			this.isBusy = false;
		}
	},
watch: {
		isEditMode(newValue) {
			this.$router.replace({
				query: { ...this.$route.query, isEdit: newValue || null }
			}).catch(e => e);

			if (newValue) {
				this.isEditMode = newValue;
				this.isEditMode = newValue;
			} 
		}
	},
	computed: {
		defaultDataFieldProperties() {
			return {
				// showDeveloperInformation: this.showDeveloperInformation,
				isEdit: this.isEditMode,
				// noValueDisplayValue: this.defaultNoValueDisplayValue
			}
		}
	},
	methods: {
		async loadInstanceAsync() {
			this.isBusy = true;
			this.legalStatusInstance = await this.getLegalStatusInstanceService.getAsync(this.$route.params.id);
			this.isBusy = false;
		},

		async saveAsync() {
			await this.saveLegislationStatusInstanceService.saveAsync(this.legalStatusInstance);
			await this.loadInstanceAsync();
			this.isEditMode = false;
		},

		async cancelAsync() {
			this.isEditMode = false;
			await this.loadInstanceAsync();
		}
	}

};
</script>