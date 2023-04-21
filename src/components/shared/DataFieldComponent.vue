<template>
	<div class="">
		<slot v-bind="allProps" @input="onInput"></slot>
		<div v-if="showDeveloperInformation">{{ referenceId }}</div>
	</div>
</template>

<script>
export default {
	props: {
		referenceId: {
			type: String
		},

		showDeveloperInformation: {
			type: Boolean,
			default: false
		},

		isEdit: {
			type: Boolean,
			default: false
		},

		item: {
			type: Object,
			default: () => { }
		}
	},

	dependencies: [
		'getCurrentUserService',
		'checkClaimsService'
	],

	data() {
		return {
			currentUser: null
		}
	},

	computed: {
		canEdit() {
			if (!this.referenceId)
				return false;

			if ([
				'Project.Area',
				'Project.Substance',
				'Project.LegalEntity',
				'Project.Legislation',
				'Proejct.Manager',
				'Project.TargetLegislationStatus'
			].indexOf(this.referenceId) > -1)
				return this.checkClaimsService.canManageArea(this.currentUser, this.item?.area);
			if (this.referenceId.indexOf('Substance') == 0)
				return true;

			return this.checkClaimsService.canWriteArea(this.currentUser, this.item?.area);
		},

		isEditInternal() {
			return this.isEdit && this.canEdit;
		},

		allProps() {
			let all = {};
			Object.assign(all, this.$attrs, this.$props);
			if (!all.field)
				all.field = this.field;

			all.isEdit = this.isEditInternal;

			return all;
		},

		field() {
			const parts = this.referenceId.split('.', 2);
			let field = parts[parts.length - 1];
			field = field.charAt(0).toLowerCase() + field.slice(1);
			return field;
		}
	},

	methods: {
		onInput(value) {
			this.$emit('input', value, this.referenceId);
		}
	},

	async created() {
		this.currentUser = await this.getCurrentUserService.getAsync();
	}
};
</script>
<style lang="scss"></style>
