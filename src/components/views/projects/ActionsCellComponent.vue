<template>
	<div class="field has-addons">
		<div class="control">
			<b-tooltip :label="$t('showProject.label')" position="is-right" :delay="1500">
				<router-link :to="'/projects/' + item.id" class="button is-small">
					<font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon v-if="canRead">
				</router-link>
			</b-tooltip>
		</div>
			<div class="control">
			<b-tooltip :label="$t('editProject.label')" position="is-right" :delay="1500">
				<router-link :to="{ path: '/projects/' + item.id, query: { isEdit: true } }" v-if="canWrite" class="button is-small">
					<font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
				</router-link>
			</b-tooltip>

		</div>
	</div>
</template>

<script>
	export default {
		props: {
			value: {},

			column: {
				type: Object
			},

			item: {
				type: Object
			},

			isEdit: {
				type: Boolean,
				default: false
			}
		},

		data() {return {
			canRead: true
		}},

		computed: {
			canWrite() {
				return this.item.canWrite;
			}
		},

		created() {
		}
	};
</script>


