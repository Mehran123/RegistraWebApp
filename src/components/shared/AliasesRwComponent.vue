<template>
	<div>
		<table class="table">
			<tbody>
				<tr v-for="alias in processedAliases">
					<td>
						<input-rw v-model="alias.name" :is-edit="isEdit" @input="aliasChangeValue(alias.name)"></input-rw>
						<b-field v-show="!isAliasCorrect" :type="{'is-danger': true }" :message="errorMessage">
					</td>
					<td>
						<button class="button is-danger is-outlined" @click="removeAlias(alias)" v-if="isEdit">
							<font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>
						</button>
					</td>
				</tr>
				<tr v-if="isEdit">
					<td colspan="2">
						<button @click="addAlias" class="button is-primary is-outlined">
							<font-awesome-icon :icon="['fas', 'plus']" class="mr-2"></font-awesome-icon>
							{{ $t('alias.add.label') }}
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import { v4 as uuid } from 'uuid';
	import { toString, get } from 'lodash';
	import { Identifier } from '../../models/Identifier'
	import { SubstanceAlias } from '../../models/SubstanceAlias'

	export default {
		props: {
			value: {
				type: Array,
				default: () => []
			},

			isEdit: {
				type: Boolean,
				default: false
			},

			item: {
				type: Object,
				required: true,
				default: () => ({})
			}
		},

		watch: {
			value(newValue) {
				if (!Array.isArray(newValue)) {
					this.aliases = [];
					return;
				}

				this.aliases = newValue;
			}
		},

		data() { return {
			aliases: this.value,
			isAliasCorrect: false,
			errorMessage : null
		}},

		computed: {
			processedAliases() {
				if (! Array.isArray(this.aliases))
					return [];

				return this.aliases;
			}
		},


		methods: {
			/**
			 * @param {SubstanceAlias} alias
			 */
			removeAlias(alias) {
				if (!confirm(this.$t('alias.delete.confirmation', { key: alias.name })))
					return;

				const index = this.aliases.indexOf(alias);
				if (index < 0)	
					return;

				this.aliases.splice(index, 1);
				this.notifyInput();
				this.$emit('aliasChange', true);
			},

			addAlias() {
				this.aliases.push(new SubstanceAlias());
				this.notifyInput();
				this.$emit('aliasChange', false);
			},
			aliasChangeValue(val){	
				let result = val.length < 3 ? false : true;
				this.isAliasCorrect = result;
				if (!result) {
					this.errorMessage="Aliaslänge ist kleine als 3"
				}
				 
				this.$emit('aliasChange', result);		
			},
			notifyInput() {
				this.$emit('input', this.aliases);
			}
		}
	};
</script>


