<template>
	<div class="contact">
		<div v-if="isEdit" class="is-edit is-flex">
			<div class="field is-grouped">
				<div class="control">
					<b-autocomplete v-model="filterValue" field="label" icon="address-card" :disabled="!internalValueSet || !internalValueSet.length" :data="processedValueSet" @select="selectContact" :open-on-focus="true" :clearable="true"></b-autocomplete>
				</div>
				<div class="control">
					<button class="button is-primary" @click="editContact" v-if="value && value.id" :title="$t('editContact.label')">
						<font-awesome-icon :icon="['fas', 'user-edit']"></font-awesome-icon>
					</button>
				</div>
				<div class="control">
					<button class="button is-primary" @click="createContact">
						<font-awesome-icon :icon="['fas', 'user-plus']" :title="$t('createNewContact.label')"></font-awesome-icon>
					</button>
				</div>
			</div>
		</div>
		<div v-if="!isEdit && displayLabel && displayLabel.length > 0">
			<button class="button" @click="showContactDetails">
				<font-awesome-icon :icon="['fas', 'address-card']" :title="$t('contactDetails.label')" class="mr-2"></font-awesome-icon>
				{{ displayLabel }}
			</button>
		</div>
		<div v-if="!isEdit && (!displayLabel || displayLabel.length == 0)">
			<font-awesome-icon :icon="['fas', 'address-card']" :title="$t('contactDetails.label')" class="mr-2"></font-awesome-icon>
			{{ noValueDisplayValue }}
		</div>

		<b-modal :active.sync="isModalActive" has-modal-card trap-focus :destroy-on-hide="false" aria-role="dialog" aria-modal>
			<div class="modal-card" style="width: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">{{ $t('contactDetails.title') }}</p>
				</header>
				<section class="modal-card-body" v-if="value">
					<div class="contact-inputs" :key="value.id">
						<div class="field">
							<label class="label">{{ $t('contact.isLegalEntity.label') }}</label>
							<b-switch type="text" v-model="value.isLegalEntity" v-if="isEdit"></b-switch>
							{{ value.isLegalEntity ? $t('yes') : $t('no')}}
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.company.label') }}</label>
							<input type="text" v-model="value.company" v-if="isEdit" />
							<div v-if="!isEdit">{{ value.company }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.firstName.label') }}</label>
							<input type="text" v-model="value.firstName" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.firstName }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.lastName.label') }}</label>
							<input type="text" v-model="value.lastName" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.lastName }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.email.label') }}</label>
							<input type="text" v-model="value.email" v-if="isEdit"  />
							<div v-if="!isEdit">
								<a :href="'mailto:' + value.email" v-if="value.email && value.email.length > 0">{{ value.email }}</a>
							</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.address1.label') }}</label>
							<input type="text" v-model="value.address1" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.address1 }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.address2.label') }}</label>
							<input type="text" v-model="value.address2" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.address2 }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.address3.label') }}</label>
							<input type="text" v-model="value.address3" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.address3 }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.phone.label') }}</label>
							<input type="text" v-model="value.phone" v-if="isEdit"  />
							<div v-if="!isEdit">
								<a :href="'tel:' + value.phone" v-if="value.phone && value.phone.length > 0">{{ value.phone }}</a>
							</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.phone2.label') }}</label>
							<input type="text" v-model="value.phone2" v-if="isEdit"  />
							<div v-if="!isEdit">
								<a :href="'tel:' + value.phone2" v-if="value.phone2 && value.phone2.length > 0">{{ value.phone2 }}</a>
							</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.country.label') }}</label>
							<input type="text" v-model="value.country" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.country }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.region.label') }}</label>
							<input type="text" v-model="value.region" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.region }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.postalCode.label') }}</label>
							<input type="text" v-model="value.postalCode" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.postalCode }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.place.label') }}</label>
							<input type="text" v-model="value.place" v-if="isEdit"  />
							<div v-if="!isEdit">{{ value.place }}</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('contact.notes.label') }}</label>
							<textarea v-model="value.notes" v-if="isEdit"></textarea>
							<div v-if="!isEdit">{{ value.notes }}</div>
						</div>
					</div>
				</section>
				<footer class="modal-card-foot">
					<button class="button" type="button" @click="isModalActive = false">
						Close
					</button>
				</footer>
			</div>
		</b-modal>
	</div>
</template>

<script>
import { find, map, isArray, isObject, orderBy, isEmpty } from 'lodash';
import { isSubStringExist } from '../../helpers/string.js';
import { filterValueSet, ValueSetItem } from 'lanxess-frontend/vuejs/ValueSet'
import { Contact, contactToValueSetItem, contactToString } from '../../models/Contact'

export default {
	props: {
		value: {
			default: () => null
		},

		valueReference: {
			default: undefined
		},

		type: {
			type: String,
			default: 'all'
		},

		isEdit: {
			type: Boolean,
			required: true,
			default: false
		},

		item: {
			type: Object,
			default: () => ({})
		},

		contacts: {
			type: Array,
			default: () => []
		},

		valueSet: {
			type: Array,
			default: () => []
		},

		countries: {
			type: Array,
			default: () => []
		},

		noValueDisplayValue: {
			type: String,
			default: '-'
		}
	},

	data() {
		return {
			filterValue: '',
			isModalActive: false,
			contact: {},
			internalValueSet: this.valueSet
		};
	},

	watch: {
		contacts: {
			handler(newValue) {
				if (isArray(newValue)) {
					this.internalValueSet = map(newValue, i => contactToValueSetItem(i));
				}
			},
			immediate: true,
			deep: true
		},

		valueSet(newValue) {
			this.internalValueSet = newValue;
		},

		value: {
			handler(newValue) {
				if (!newValue)
					this.contact = null;
				else
					this.contact = newValue;
			},
			immediate: true
		},

		'project.consortium': {
			handler(newValue) {

				// const id = newValue[this.field];
				// this.contact = find(this.contacts, ['id', id]) || this.contactTemplate;

				// this.selectedContactLastName = this.contact.lastName;
				// this.selectedContactCompany = this.contact.company;
			},
			immediate: true,
			deep: true
		},

		'contact': {
			handler(newValue) {
				if (!newValue)
					this.filterValue = '';
				else
					this.filterValue = contactToString(newValue);
			},
			immediate: true,
			deep: true
		},
	},

	computed: {
		displayLabel() {
			if (!this.value)
				return '';

			return contactToString(this.value);
		},

		isIncludingNaturalContacts() {
			return this.type === 'natural' || this.type === 'all';
		},

		isIncludingLegalContacts() {
			return this.type === 'legal' || this.type === 'all';
		},

		processedValueSet() {
			if (!isArray(this.internalValueSet) || isEmpty(this.internalValueSet))
				return [];

			return orderBy(filterValueSet(this.internalValueSet, this.filterValue), i => i?.label);
		}
	},

	methods: {
		// async updateContact() {
		// 	try {
		// 		const contact = await this.$contactService.updateContactAsync({
		// 			...this.contact,
		// 			lastName: this.selectedContactLastName || this.contact.lastName,
		// 			company: this.selectedContactCompany || this.contact.company,
		// 			isLegalEntity: !this.isUserType
		// 		});

		// 		this.selectContact(contact);
		// 		this.contacts.push(contact);

		// 		this.isModalActive = false;
		// 	} catch (ex) {
		// 		console.error(ex);
		// 	}
		// },

		selectContact(valueSetItem) {
			if (!valueSetItem) {
				return;
			}

			this.$emit('input', valueSetItem.value);
			this.$emit('update:referenceValue', valueSetItem.referenceValue);
		},

		editContact() {
			if (!isObject(this.value))
				return;

			this.isModalActive = true;
		},

		createContact() {
			const contact = new Contact();
			this.$emit('input', contact);
			this.$emit('update:referenceValue', contact.id);
			this.$emit('create', contact);
			this.isModalActive = true;
		},

		showContactDetails() {
			this.isModalActive = true;
		}
	}
};
</script>

<style lang="scss" scoped>
	.contact-inputs {
		min-width: 400px;
	}

	.modal-card-foot {
		display: flex;
		justify-content: flex-end;
	}
</style>
