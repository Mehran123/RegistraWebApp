<template>
	<span class="cell-wrapper text-truncate" :class="cellClasses" @dblclick="openEdit">
		<cell-checkbox v-if="header.columnType === 'boolean'" :value="value" :disabled="saving || !canEdit" @close-edit="closeEdit" />
		<template v-else>
			<template v-if="isEdit">
				<cell-dropdown v-if="dictionaries[header.dictionary]" :value="value" :header="header" :dictionaries="dictionaries" @close-edit="closeEdit" />
				<cell-input v-else :value="value" @close-edit="closeEdit" />
			</template>
			<v-overlay class="overlay" absolute color="rgba(248, 248, 248, 0.8)" :value="saving">
				<v-progress-circular color="blue" indeterminate size="16" />
			</v-overlay>
			<component :is="tableConfig[header.key].component" v-if="!isEdit" class="cell d-flex px-3 py-1 w-auto" v-bind="tableConfig[header.key].attrs" :style="tableConfig[header.key].style" :class="tableConfig[header.key].class">
				<template v-if="showTooltip">
					<v-tooltip bottom class="w-100">
						<template v-slot:activator="{ on }">
							<span class="cell-inner w-100 text-truncate text-black" v-on="on">
								{{ row[header.key] }}
							</span>
						</template>
						<span>{{ row[header.key] }}</span>
					</v-tooltip>
				</template>
				<template v-else>
					{{ row[header.key] }}
				</template>
			</component>
		</template>
	</span>
</template>

<script>
	import { mapState } from 'vuex';
	import { tableConfig } from '~/helpers/project-table-configs';
	import { toString } from 'lodash';
	import CellDropdown from './CellDropdown';
	import CellInput from './CellInput';
	import CellCheckbox from './CellCheckbox';

	export default {
		components: { CellCheckbox, CellInput, CellDropdown },
		props: {
			header: {
				required: true,
				type: Object,
				default: () => ({})
			},

			row: {
				required: true,
				type: Object,
				default: () => ({})
			},

			rowIndex: {
				required: true,
				type: Number,
				default: null
			},

			canEdit: {
				required: true,
				type: Boolean,
				default: false
			},

			onCloseEdit: {
				required: true,
				type: Function,
				default: async () => {}
			}
		},

		data() {
			return {
				tableConfig,
				isEdit: false,
				oldValue: this.row[this.header.key],
				value: this.row[this.header.key],
				saving: false
			};
		},

		computed: {
			...mapState('projects', ['dictionaries']),

			showTooltip() {
				return !!this.row[this.header.key] && this.row[this.header.key].toString().length >= 22;
			},

			cellClasses() {
				return {
					'cursor-pointer': this.canEdit
				};
			}
		},

		methods: {
			openEdit() {
				if (this.canEdit) {
					this.isEdit = true;
				}
			},

			async closeEdit(newValue) {
				this.value = newValue;
				if (this.value === this.row[this.header.key]) {
					this.isEdit = false;
					return;
				}

				this.saving = true;

				try {
					await this.onCloseEdit({
						projectId: this.row.id,
						key: this.header.key,
						rowIndex: this.rowIndex,
						rowId: this.row.id,
						newValue: toString(this.value),
						oldValue: this.row[this.header.key]
					});
				} catch (ex) {
					this.value = this.oldValue;
					console.error(ex);
				} finally {
					this.isEdit = false;
					this.saving = false;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	$cell-width: 210px;

	.overlay {
		width: 100%;
		max-width: $cell-width;
	}

	.cell {
		height: 33px;
		width: 100%;
		max-width: $cell-width;
		border: 2px solid transparent;
		color: #000;

		&:hover {
			border: 2px solid #609ae5;
		}

		&-wrapper {
			position: relative;
		}

		&-inner {
			max-width: $cell-width;
		}
	}
</style>
