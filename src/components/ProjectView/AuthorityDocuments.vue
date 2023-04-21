<template>
	<div class="authority-documents">
		<b-table class="authority-documents__table b-table" :data="data">
			<template slot-scope="props">
				<b-table-column label="No">
					{{ props.index + 1 }}
				</b-table-column>
				<b-table-column label="Name" width="280">
					{{ props.row.name }}
				</b-table-column>
				<b-table-column label="Type">
					{{ props.row.type }}
				</b-table-column>
				<b-table-column label="Additional Info">
					<template v-if="props.row.submissionReferenceId">
						<strong>Submission Number:</strong>
						{{ props.row.submissionReferenceId }};
					</template>
					<template v-if="props.row.reason">
						<strong>Reason:</strong>
						{{ props.row.reason }}
					</template>
					<template v-if="!props.row.submissionReferenceId && !props.row.reason">
						<span>—</span>
					</template>
				</b-table-column>
				<b-table-column label="Creation Date" width="150">
					{{ props.row.createdAt | formatDate }}
				</b-table-column>
				<b-table-column label="Action" centered>
					<div class="is-flex justify-center">
						<b-button icon-right="download" size="is-small" outlined :disabled="deleting" @click="downloadDocument(props.row.id)" />
						<b-button v-if="isEditMode" icon-right="delete" size="is-small" type="is-danger" outlined :loading="deleting" @click="deleteDocument(props.row.id)" />
					</div>
				</b-table-column>
			</template>
			<template slot="footer" class="authority-documents__table-footer">
				<div class="d-flex justify-space-between">
					<b-button v-if="isEditMode" tag="a" class="button  is-primary has-text-weight-normal" @click="openModal">
						<b-icon icon="upload"></b-icon>
						<span>Upload</span>
					</b-button>
					<b-button :loading="refreshing" @click="refresh">Refresh</b-button>
				</div>
			</template>
		</b-table>
		<authority-documents-modal ref="documentsModal" :project="project" @refresh="refresh" />
	</div>
</template>

<script>
	import get from 'lodash/get';
	import { format } from 'date-fns';
	import AuthorityDocumentsModal from './AuthorityDocumentsModal.vue';

	export default {
		props: {
			project: {
				type: Object,
				required: true,
				default: () => ({})
			},

			isEditMode: {
				type: Boolean,
				default: false
			}
		},

		components: {
			AuthorityDocumentsModal
		},

		filters: {
			truncate(value, length) {
				return value.length > length ? value.substr(0, length) + '...' : value;
			},

			formatDate(date) {
				return date ? format(new Date(date), 'dd-MM-yyyy HH:mm') : '—';
			}
		},

		data() {
			return {
				data: [],
				refreshing: false,
				deleting: false
			};
		},

		created() {
			this.data = this.project.attachments;
		},

		methods: {
			openModal() {
				this.$refs.documentsModal.openModal();
			},

			async refresh() {
				this.refreshing = true;

				try {
					const project = await this.$projectService.getProjectAsync(this.$route.params.id);
					this.data = get(project, 'attachments');
				} catch (ex) {
					console.error(ex);
				} finally {
					this.refreshing = false;
				}
			},

			async downloadDocument(id) {
				const resp = await this.$projectService.getProjectAttachmentAsync(id);
				const fileLink = resp.link.slice(6);
				const url = `${this.$axios.defaults.baseURL}/files/${fileLink}`;
				window.open(url, '_blank');
			},

			async deleteDocument(id) {
				this.deleting = true;

				try {
					await this.$projectService.deleteProjectAttachmentAsync(id);
					await this.refresh();
				} catch (ex) {
					console.error(ex);
				} finally {
					this.deleting = false;
				}
			}
		}
	};
</script>

<style lang="scss">
	.authority-documents {
		border: 1px solid #dbdbdb;
		border-radius: 4px;

		&__table {
			.table {
				min-height: 220px;
			}
		}
	}
</style>
