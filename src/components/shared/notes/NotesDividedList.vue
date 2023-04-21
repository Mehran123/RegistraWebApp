<template>
	<div class="notes">
		<div v-if="isEdit" class="notes-list">
			<label class="label">{{ $t('project.notes.label') }} / {{ $t('project.tasks.label') }}</label>
			<note-item v-for="(note, i) in notes" :key="note.id" :note="note" :item="item" :is-edit="isEdit" :index="i" :opened-index.sync="openedIndex" @delete-note="deleteNote"></note-item>
		</div>

		<template v-else>
			<div class="tasks-title">
				<label class="label">{{ notesLabel }}</label>
				<button v-if="notesList.length" class="button is-white" @click="toggleNotesFiltered">
					{{ filteringNoteLabel }}
				</button>
			</div>
			<div class="notes-list divided">
				<note-item v-for="(note, i) in notesList" :key="note.id" :note="note" :item="item" :is-edit="isEdit" :index="i" :opened-index.sync="openedIndex" @delete-note="deleteNote"></note-item>
			</div>
			<div class="field">
				<div class="tasks-title">
					<label class="label">{{ tasksLabel }}</label>
					<button v-if="tasksList.length" class="button is-white" @click="toggleTasksFiltered">
						{{ filteringTasksLabel }}
					</button>
				</div>

				<note-item v-for="(task, i) in tasksList" :key="task.id" :note="task" :item="item" :is-edit="isEdit" :index="i" :opened-index.sync="openedIndex" @delete-note="deleteNote"></note-item>
			</div>
		</template>
		<button v-if="isEdit" class="button is-primary notes__add" @click="addNote">
			Add Note
		</button>
	</div>
</template>

<script>
	import { useNotesSorting } from './composition/useNotesSorting.js';
	import NoteItem from './NoteItem.vue';
	import { useNotesActions } from './composition/useNotesActions';

	export default {
		components: {
			NoteItem
		},

		props: {
			notes: {
				type: Array,
				required: true,
				default: () => []
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
			},

			defaultOpenedIndex: {
				type: Number,
				default: -1
			},

			templateInfo: {
				type: Object,
				default: () => ({})
			}
		},

		setup(props, context) {
			return {
				...useNotesSorting(props, context),
				...useNotesActions(props)
			};
		}
	};
</script>

<style lang="scss" scoped>
	.notes {
		&-list {
			&.divided {
				margin-bottom: 12px;
			}
		}

		&__add {
			margin-top: 14px;
		}
	}

	.tasks-title {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;

		& label {
			margin-bottom: 0 !important;
		}

		& button {
			padding-top: 0;
			padding-bottom: 0;
		}
	}
</style>
