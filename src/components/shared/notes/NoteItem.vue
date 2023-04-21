<template>
	<b-collapse ref="collapse" class="card" animation="slide" :open="showCollapse" :aria-id="`note-${note.id}`">
		<div slot="trigger" slot-scope="props" class="card-header" role="button" aria-controls="contentIdForA11y3" @click.stop>
			<div v-if="isEdit" class="note__is-edit">
				<div class="note__title-wrapper">
					<b-checkbox v-if="isTask" v-model="note.isFinished" @click.stop></b-checkbox>
					<a class="w-100" @click="openCollapse">
						<!-- <input-with-validation rules="required" :name="`note-title-${note.id}`" type="text" placeholder="Enter title" class="note__title-input" v-model="note.title" /> -->
						<input type="text" class="input" v-model="note.title" />
					</a>
					<a class="card-header-icon" @click="toggleCollapse">
						<b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
					</a>
				</div>
			</div>
			<a v-else class="note__title-wrapper activator" @click="toggleCollapse">
				<div class="is-flex w-100">
					<div class="note__title">
						<b-checkbox v-if="isTask" :value="note.isFinished" disabled />
						<span class="label">
							{{ note.title }}
						</span>
					</div>

					<div v-if="!!note.content" class="card-header-icon">
						<b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
					</div>
				</div>

				<div class="note__date">{{ noteDate }}</div>
			</a>
		</div>
		<div class="card-content">
			<div v-if="isEdit" class="note__is-edit">
				<b-switch v-model="note.type" true-value="Task" false-value="Default">
					Is Task
				</b-switch>
				<textarea class="note__content-input" v-model="note.content" cols="80" rows="10"></textarea>
				<div class="actions">
					<button class="button is-danger is-outlined note__delete" @click="$emit('delete-note', note.id)">
						Delete
					</button>
				</div>
			</div>
			<div v-else class="note__content" v-html="content" />
		</div>
	</b-collapse>
</template>

<script>
	import marked from 'marked';
	import { dateFormat } from '../../../helpers/date';
	import moment from 'moment';

	export default {
		props: {
			note: {
				type: Object,
				required: true,
				default: () => {}
			},

			index: {
				type: Number,
				required: true,
				default: 0
			},

			openedIndex: {
				type: Number,
				required: true,
				default: -1
			},

			isEdit: {
				type: Boolean,
				required: true,
				default: false
			},

			item: {
				type: Object,
				required: true,
				default: () => ({})
			}
		},

		watch: {
			isEdit(isEdit) {
				if (!isEdit) {
					this.$emit('update:opened-index', -1);
				}
			},

			openedIndex(newIndex) {
				if (newIndex !== this.index && this.$refs.collapse.isOpen) {
					this.$refs.collapse.toggle();
				}
			},

			'note.title': {
				handler() {
					this.updateDate();
				}
			},

			'note.content': {
				handler() {
					this.updateDate();
				}
			},

			'note.isFinished': {
				handler() {
					this.updateDate();
				}
			},

			'note.type': {
				handler() {
					this.updateDate();
				}
			}
		},

		computed: {
			content() {
				return marked(this.note.content);
			},

			noteDate() {
				return this.note.updatedAt ? moment(this.note.updatedAt).format(dateFormat) : '';
			},

			showCollapse() {
				if (this.openedIndex && (!!this.note.content || this.isEdit)) {
					return this.openedIndex === this.index;
				} else {
					return false;
				}
			},

			isTask() {
				return this.note.type === 'Task';
			}
		},

		methods: {
			updateDate() {
				const date = new Date();
				if (this.note.updatedAt !== date) {
					this.note.updatedAt = moment(new Date()).format();
				}
			},

			openCollapse() {
				if (!this.$refs.collapse.isOpen) {
					this.$emit('update:opened-index', this.index);
					this.$refs.collapse.toggle();
				}
			},

			toggleCollapse() {
				if (!!this.note.content || this.isEdit) {
					this.$emit('update:opened-index', this.index);
					this.$refs.collapse.toggle();
				}
			}
		}
	};
</script>

<style lang="scss">
	.note {
		margin-bottom: 16px;

		&__delete {
			margin-top: 16px;
		}

		&__is-edit {
			display: flex;
			flex-wrap: wrap;
			width: 100%;

			& > * {
				width: 100%;
			}
		}

		&__title {
			padding: 0.75rem;
			width: 100%;
			display: flex;
			align-items: center;

			&-input {
				width: 100%;

				input {
					margin-top: 16px;
				}
			}

			&-wrapper {
				display: flex;
				align-items: center;
				width: 100%;
				padding-left: 10px;

				&.activator {
					flex-wrap: wrap;

					.note__date {
						padding: 0 0 0.75rem 0.75rem;
						color: #909090;
					}
				}
			}
		}

		&__content {
			&-input {
				margin-top: 12px;
				color: #363636;
				box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
				padding: calc(0.375em - 1px) calc(0.625em - 1px);
				border-radius: 4px;
				border: 1px solid #b5b5b5;
				resize: none;

				&:focus {
					border-color: #1a73e8;
					box-shadow: 0 0 0 0.125em rgba(26, 115, 232, 0.25);
				}
			}
		}
	}

	.card {
		&_header {
			align-items: center;
		}
	}
</style>
