<template>
	<editable-base :is-edit="isEdit" :display-value="substanceName" class="substance">
		<div class="is-edit is-flex">
			<!-- <input-with-validation v-model="substanceName" inputType="autocomplete" type="text" name="substance" field="name" rules="required" :data="filteredSubstances(substanceName)" @select="selectSubstance" /> -->
			<input type="text" v-model="substanceName" class="input" />
			<button class="button is-primary" @click="showModal">
				Edit
			</button>
		</div>
		<b-modal aria-role="dialog" :width="610" :active.sync="isModalActive" :destroy-on-hide="false" :can-cancel="false" aria-modal has-modal-card trap-focus>
			<div class="modal-card" style="width: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Substance</p>
				</header>
				<section class="modal-card-body">
					<validation-observer ref="form">
						<div class="substance-inputs">
							<!-- <input-with-validation ref="substanceNameInput" v-model="newSubstanceName" inputType="autocomplete" type="text" name="manager" label="Substance name" field="name" rules="required" :data="filteredSubstances(newSubstanceName)" @select="selectSubstance" /> -->
							<input type="text" class="input" v-model="newSubstanceName" />

							<div class="field">
								<b-switch v-model="substance.isNano">
									Is Nano
								</b-switch>
							</div>

							<div class="field">
								<b-switch v-model="substance.isPbt">
									Is Pbt
								</b-switch>
							</div>

							<identifier class="identifiers" idField="substanceId" :item="substance" :identifiers="substance.identifiers" is-edit></identifier>
						</div>
					</validation-observer>
				</section>
				<footer class="modal-card-foot">
					<button class="button" type="button" @click="isModalActive = false">
						Close
					</button>
					<button class="button is-primary" @click="updateSubstance">
						Save
					</button>
				</footer>
			</div>
		</b-modal>
	</editable-base>
</template>

<script>
	import { v4 as uuid } from 'uuid';
	import { get } from 'lodash';
	import { ValidationObserver } from 'vee-validate';
	import { isSubStringExist } from '../../helpers/string.js';
	import EditableBaseComponent from 'lanxess-frontend/vuejs/components/EditableBase.vue';

	export default {
		components: {
			'editable-base': EditableBaseComponent,
			ValidationObserver
		},

		props: {
			field: {
				type: String,
				default: 'substance'
			},

			project: {
				type: Object,
				required: true,
				default: () => ({})
			},

			substances: {
				type: Array,
				required: true,
				default: () => []
			},

			isEdit: {
				type: Boolean,
				default: true
			}
		},

		data() {
			return {
				substanceName: get(this.project, 'substance.name'),
				newSubstanceName: get(this.project, 'substance.name'),
				isModalActive: false,
				substance: {
					id: uuid(),
					isNano: false,
					isPbt: false,
					identifiers: []
				},
				substanceTemplate: {
					expertUserId: null,
					isNano: true,
					isPbt: true,
					name: '',
					identifiers: []
				}
			};
		},

		watch: {
			substanceName(newValue) {
				if (this.project.substance.name !== newValue) {
					this.resetSubstance(newValue);
				}
			},

			newSubstanceName(newValue) {
				if (this.project.substance.name !== newValue) {
					this.resetSubstance(newValue);
				}
			},

			isModalActive(newValue) {
				if (newValue) {
					this.newSubstanceName = this.substanceName;
				}
			}
		},

		methods: {
			resetSubstance(name) {
				if (this.project.substance.name !== name) {
					this.substance = {
						id: uuid(),
						identifiers: [],
						isNano: this.substance.isNano,
						isPbt: this.substance.isPbt
					};
				}
			},

			async updateSubstance() {
				try {
					const valid = await this.$refs.form.validate();

					if (!valid) {
						return this.$buefy.toast.open({
							duration: 3000,
							message: `Please, fill all fields`,
							position: 'is-bottom-right',
							type: 'is-danger'
						});
					}

					const substance = await this.$substanceService.updateSubstanceAsync({
						...this.substance,
						name: this.newSubstanceName || this.substance.name
					});

					this.selectSubstance(substance);
					this.substances.push(substance);

					this.isModalActive = false;
				} catch (ex) {
					console.error(ex);
				}
			},

			selectSubstance(substance) {
				if (!substance) {
					return;
				}

				this.substance = {
					identifiers: [],
					...substance
				};

				this.project.substance = this.substance;
				this.substanceName = this.substance.name;
				this.newSubstanceName = this.substance.name;
			},

			filteredSubstances(name = '') {
				return this.substances.filter(substance => {
					return isSubStringExist(substance.name, name);
				});
			},

			showModal() {
				this.isModalActive = true;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.substance-inputs {
		min-width: 400px;
	}

	.modal-card-foot {
		display: flex;
		justify-content: flex-end;
	}

	.modal-card-body {
		width: 610px;
	}
</style>
