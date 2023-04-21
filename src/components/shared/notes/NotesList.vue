<template>
	<div class="note">
		<div class="tasks-title">
			<label class="label mb-1"
				>{{ label }}<span v-if="emptyNotesLabel" class="has-text-weight-light is-italic">: {{ emptyNotesLabel }}</span></label
			>
			<button v-if="!isEdit && allNotesList.length" class="button is-white" @click="toggleNotesFiltered">
				{{ filteringNoteLabel }}
			</button>
		</div>
		<div v-if="notes && notes.length" class="notes-list mb-4">
			<note-item v-for="(note, i) in notes" :key="note.id" :note="note" :item="item" :is-edit="isEdit" :index="i" :opened-index.sync="openedIndex" @delete-note="deleteNote"></note-item>
		</div>
		<button v-if="isEdit" class="button is-primary mt-0 notes__add" @click="addNote">
			Add Note
		</button>
	</div>
</template>

<script>
	import NoteItem from './NoteItem.vue';
	import { useNotesSorting } from './composition/useNotesSorting';
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

			label: {
				type: String,
				default: 'Notes'
			},

			defaultOpenedIndex: {
				type: Number,
				default: -1
			}
		},

		setup(props, context) {
			const { emptyNotesLabel, allNotesList, toggleNotesFiltered, filteringNoteLabel } = useNotesSorting(props, context);

			return {
				emptyNotesLabel,
				allNotesList,
				toggleNotesFiltered,
				filteringNoteLabel,
				...useNotesActions(props)
			};
		}
	};
</script>

<style lang="scss" scoped>
	.notes {
		&__add {
			margin-top: 14px;
		}
	}

	.tasks-title {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;

		& button {
			padding-top: 0;
			padding-bottom: 0;
		}
	}
</style>
