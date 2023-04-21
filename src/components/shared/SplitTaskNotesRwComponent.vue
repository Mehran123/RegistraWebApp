<template>
	<div>
		<local-notes-rw v-bind="allProps" @input="onInput" type="Task" @arraychanged="onArrayChange" class="mb-6"></local-notes-rw>
		<local-notes-rw v-bind="allProps" @input="onInput" @arraychanged="onArrayChange" :type="['Default', 'Note']"></local-notes-rw>
	</div>
</template>

<script>
import NotesRwComponent from './NotesRwComponent.vue'

export default {
	props: {
		value: {
			type: Array,
			default: () => []
		},

		type: {
			type: String,
			default: 'all'
		},

		isEdit: {
			type: Boolean,
			default: false
		}
	},

	components: {
		'local-notes-rw': NotesRwComponent
	},

	computed: {
		allProps() {
			let all = {};
			Object.assign(all, this.$attrs, this.$props);
			if (!all.field) all.field = this.field;

			return all;
		},
	},

	methods: {
		onInput(val) {
			this.$emit('input', val);
		},
		onArrayChange(val){
			this.$attrs.item.notes = val;
		}
	}
}
</script>

<style>

</style>