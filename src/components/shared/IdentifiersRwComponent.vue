<template>
	<div class="identifier">
		<table class="table is-narrow has-no-cell-borders w-100">
			<thead>
				<tr>
					<th>Type</th>
					<th>Value</th>
					<th v-show="isEdit"></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(identifier, i) in identifiers" :key="identifier.id">
					<td>
						<b-autocomplete open-on-focus clearable v-model="identifier.key" v-if="isEdit" :data="identifierSuggestions(identifier.key)" @select="option => (selected = option)"></b-autocomplete>
						<span v-show="!isEdit">{{ identifier.key }}</span>
					</td>
					<td>
						<!-- <b-field :type="{'is-danger': identifierFailed }"
							:message="errorMessage"> -->
					<b-field>
							<b-input style="width:150px" type="text"
								v-model="identifier.value"
								 v-show="isEdit"
								@input="identifierChange(i)">
							</b-input>
						</b-field>
							
						<span v-show="!isEdit">{{ identifier.value }}</span>
					</td>
					<td v-show="isEdit">
						<button @click="removeIdentifier(i)" class="button is-danger is-outlined">
							<font-awesome-icon :icon="['fas', 'trash-alt']" ></font-awesome-icon>
						</button>
					</td>
					
				</tr>
				<tr>
					<b-field v-show="!isMatch" :type="{'is-danger': identifierFailed }"
					:message="errorMessage">
				</tr>
				<tr colspan="3">
					<button :disabled="identifierFailed" v-if="isEdit" @click="addIdentifier" class="button is-primary is-outlined">
						<font-awesome-icon :icon="['fas', 'plus']" class="mr-2"></font-awesome-icon>
						{{ $t('identifier.add.label') }}
					</button>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import { v4 as uuid } from 'uuid';
	import { toString, get } from 'lodash';
	import { Identifier } from '../../models/Identifier'

	export default {
		props: {
			value: {
				type: Array,
				default: () => []
			},

			identifierReferenceId: {
				type: String,
				default: 'projectId'
			},

			isEdit: {
				type: Boolean,
				default: false
			},

			item: {
				type: Object,
				required: true,
				default: () => ({})
			},

			predefinedKeys: {
				type: Array,
				default: () => []
			},
		},
		watch: {
			value(newValue) {
				if (!Array.isArray(newValue)) {
					this.identifiers = [];
					return;
				}

				this.identifiers = newValue;
			}
		},
		data() { return {
			identifiers: this.value,
			selected:null,
			identifierFailed: false,
			errorMessage:null,
			patternEc: /[1-9]\d{2}[-]\d{3}[-]\d/,
			patternCas: /\d+\-\d{2}[-]\d{1}/g,
			matchTrue: false,
			RSumme: 0,
			isMatch: true,
			// key: null,
			canCreate:true
		}},


		methods: {
			identifierChange(env){
				this.errorMessage = null;
				this.identifierFailed= false;
				this.canCreate=true;
				let key = this.identifiers[env].key;	
				if (key.toLowerCase() != "ec" && key.toLowerCase() != "cas") {
					this.canCreate = this.identifiers[env].value.length > 0;
					this.$emit('identifierCallBack', this.canCreate);
				}		
				if(key.toLowerCase() == "ec" )
				{
					// if(!env.match(this.patternEc))
					if(!this.identifiers[env].value.match(this.patternEc))
					{
						this.isMatch = false;
						this.identifierFailed= true;
						this.errorMessage= "EC number is digits with the format XXX-XXX-X";
						this.canCreate=false;
						this.$emit('identifierCallBack', this.canCreate);
					}
					
					this.$emit('identifierCallBack', this.canCreate);
					return true;
				}
				if(key.toLowerCase() == "cas")
				{
					let currentValue = this.identifiers[env].value;

					if (!currentValue.match(this.patternCas)) {
						this.isMatch = false;
						this.identifierFailed= true;
						this.errorMessage="Wrong CAS number xxx..xx-xx-x";
						this.matchtrue = false;
						this.canCreate= false;
						this.$emit('identifierCallBack', this.canCreate);
						return;
					}

					const indexLast = currentValue.lastIndexOf('-');
					const indexFirst = currentValue.indexOf('-');
					const secondValue = currentValue.substring(indexFirst+1,indexLast);

					let casnumber = currentValue.substring(0,indexLast)
					let checkSum = currentValue.substring(casnumber.length + 1);
					casnumber = casnumber.replace(/-/g, '');
					const usingSpread = [...casnumber];
					let usingArrayFrom = Array.from(casnumber);
					console.log(usingArrayFrom);
						usingArrayFrom = usingArrayFrom.reverse();
						console.log(usingArrayFrom);
					
					for (let index = 0; index < usingArrayFrom.length; index++) {
							this.RSumme += usingArrayFrom[index] * (index + 1);
					}

					let rMode = this.RSumme % 10;

					if (checkSum && checkSum != rMode) {
						this.identifierFailed= true;
						this.errorMessage="Invalid CAS number";
						this.$emit('identifierCallBack', this.canCreate);
						this.canCreate=false;
					}
					this.RSumme = 0;
					this.$emit('identifierCallBack', this.canCreate);
				}
				
			},
			identifierSuggestions(key) {
				// this.key = key;
				return this.predefinedKeys.filter(identifier => {
					return (
						identifier
							?.toLowerCase()
							?.indexOf(toString(key).toLowerCase()) >= 0
					);
				});
			},

			removeIdentifier(i) {
				if (!confirm(this.$t('identifier.delete.confirmation', { key: this.identifiers[i].key })))
					return;

				this.identifiers.splice(i, 1);
				this.notifyInput();
				this.errorMessage = '';
				this.isMatch=true;
				this.identifierFailed=false;
				this.$emit('identifierCallBack', true);
			},

			addIdentifier() {
				const identifier = new Identifier();
				if (this.item && this.identifierReferenceId)
					identifier[this.identifierReferenceId] = this.item.id;

				this.identifiers.push(identifier);
				this.notifyInput();
			},

			notifyInput() {
				this.$emit('input', this.identifiers);
			},

			checkIdentifierKey(key) {
				return this.predefinedKeys.indexOf(key) > -1;
			}
		}
	};
</script>

<style lang="scss">
	.identifier {
		&__input {
			display: flex;
			align-items: flex-start;
			flex-wrap: nowrap;
			width: 100%;

			&-name {
				margin-right: 30px;
			}

			&-delete {
				margin-top: 32px;
			}
		}

		&__item {
			display: flex;
			flex-wrap: wrap;
			width: 100%;

			&-name {
				margin-right: 6px;
			}
		}
	}
</style>
