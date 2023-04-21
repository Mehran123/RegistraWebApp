<template>
	<div class="authority-documents-modal">
		<b-modal :active.sync="isModalActive" trap-focus :destroy-on-hide="false" :can-cancel="false" :width="450" aria-role="dialog" aria-modal>
			<form action="">
				<div class="modal-card" style="width: auto">
					<header class="modal-card-head">
						<p class="modal-card-title">Upload Document</p>
					</header>
					<section class="modal-card-body">
						<b-field label="Document Type" class="mb-4">
							<b-select v-model="documentType" name="documentType" expanded>
								<option v-for="item in documentTypes" :key="item.value" :value="item" :selected="item.value === documentType.value">{{ item.label }} </option>
							</b-select>
						</b-field>

						<transition name="fade">
							<div v-if="isWorkflow">
								<!-- <input-with-validation v-model="submissionReferenceId" name="submissionReferenceId" label="Submission Number" class="mb-4" /> -->
								<div class="field">
									<label class="label">Submission Number</label>
									<input type="text" v-model="submissionReferenceId" class="input" />
								</div>
								<!-- <input-with-validation v-model="reason" name="reason" label="Reason" class="mb-4" /> -->
								<div class="field">
									<label class="label">Reason</label>
									<input type="text" v-model="reason" class="input" />
								</div>
							</div>
						</transition>
						<authority-documents-uploader v-model="files" @drop="uploadFiles" />
					</section>
					<footer class="modal-card-foot d-flex justify-flex-end">
						<div class="d-flex">
							<b-button @click="closeModal">Close</b-button>
							<b-button :loading="loading" :disabled="disableUpload" class="button is-primary has-text-weight-normal" @click="upload">
								Upload
							</b-button>
						</div>
					</footer>
				</div>
			</form>
		</b-modal>
	</div>
</template>

<script>
	import isEmpty from 'lodash/isEmpty';
	import AuthorityDocumentsUploader from './AuthorityDocumentsUploader';

	export default {
		components: { AuthorityDocumentsUploader },
		props: {
			project: {
				type: Object,
				required: true,
				default: () => ({})
			}
		},

		data() {
			const documentTypes = [
				{
					value: 'Document',
					label: 'General Documents'
				},
				{
					value: 'Workflow',
					label: 'Workflow Documents'
				}
			];

			return {
				files: [],
				documentTypes,
				documentType: documentTypes[0],
				submissionReferenceId: '',
				reason: '',
				loading: false,
				addingFiles: false,
				isModalActive: false
			};
		},

		computed: {
			isWorkflow() {
				const workflow = this.documentTypes[1] || {};
				return this.documentType.value === workflow.value;
			},

			disableUpload() {
				return isEmpty(this.files) || this.loading;
			}
		},

		methods: {
			closeModal() {
				this.isModalActive = false;
			},

			openModal() {
				this.isModalActive = true;
			},

			arrayBufferToBase64(buffer) {
				let binary = '';
				const bytes = new Uint8Array(buffer);
				const len = bytes.byteLength;
				for (let i = 0; i < len; i++) {
					binary += String.fromCharCode(bytes[i]);
				}

				return window.btoa(binary);
			},

			async upload() {
				this.loading = true;
				for (const file of this.files) {
					await this.sendData(file);
				}

				this.$emit('refresh');
				this.loading = false;
				this.closeModal();
			},

			async sendData({ name, file }) {
				const data = {
					type: this.documentType.value,
					submissionReferenceId: this.submissionReferenceId,
					reason: this.reason,
					file: this.arrayBufferToBase64(file),
					name,
					projectId: this.project.id
				};

				await this.$projectService.addProjectAttachmentAsync(data);
			},

			uploadFiles(files) {
				this.files = [];

				for (const file of files) {
					this.prepareFile(file);
				}
			},

			prepareFile(file) {
				this.addingFiles = true;
				const reader = new FileReader();
				reader.onload = e => {
					this.files.push({ name: file.name, file: e.target.result });
					this.addingFiles = false;
				};

				reader.onerror = this.onReadingFileError;
				reader.readAsArrayBuffer(file);
			},

			onReadingFileError() {
				this.$toast({
					message: 'Can not read the file. Try again.',
					type: 'is-danger',
					duration: 4000
				});
			}
		}
	};
</script>

<style lang="scss">
	.authority-documents-modal {
	}
</style>
