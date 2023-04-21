<template>
	<div>
		<div>
			<table  class="table">
				<thead>
					<tr>
						<th>{{ $t('attachment.name.label') }}</th>
						<th>{{ $t('attachment.dueAt.label') }}</th>
						<th>{{ $t('attachment.remindAt.label') }}</th>
						<th>{{ $t('attachment.tags.label') }}</th>
						<th v-for="attribute in attributes">
							{{ $t(`project.attachments.attributes.${attribute}.label`) }}	
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="attachment in processedAttachments">
						<td>
							<input type="text" class="input" v-model="attachment.name" v-if="isEdit" />
							<span v-if="!isEdit"><a :href="getAttachmentUrl(attachment.id)" target="_blank" :download="attachment.name" :type="attachment.mimeType">{{ attachment.name }}</a></span>
						</td>
						<td>
							<input-date-rw v-model="attachment.dueAt" :is-edit="isEdit"></input-date-rw>
						</td>
						<td>
							<input-date-rw v-model="attachment.remindAt" :is-edit="isEdit"></input-date-rw>
						</td>
						<td>
							<b-taginput v-model="attachment.tags" v-if="isEdit" allow-new autocomplete :data="filteredTags" @typing="updateFilteredTags"></b-taginput>
							<div class="tags" v-if="attachment && attachment.tags">
								<span class="tag" v-for="tag in attachment.tags">{{tag}}</span>
							</div>
						</td>
						<td v-for="attribute in attributes">
							<input type="text" class="input" v-model="attachment.attributes[attribute]" v-if="isEdit"  />
							<span v-if="!isEdit">{{ attachment && attachment.attributes && attachment.attributes[attribute] ? attachment.attributes[attribute] : '' }}</span>
						</td>
						<td>
							<button class="button" @click="deleteAttachment(attachment)" v-if="isEdit">
								<font-awesome-icon :icon="['fas', 'trash-alt']" class="mr-2"></font-awesome-icon>
								{{ $t('delete.label') }}
							</button>
						</td>
					</tr>
					<tr v-if="(! processedAttachments || processedAttachments.length == 0)">
						<td :colspan="5 + attributes.length" class="is-italic has-text-centered">{{ $t('attachment.noAttachments') }}</td>
					</tr>
					<tr v-if="isEdit">
						<td :colspan="5 + attributes.length">
							<b-upload @input="onFileAttach" multiple drag-drop expanded native>
								<section class="section">
								<div class="content has-text-centered">
									<p>
										<font-awesome-icon :icon="['fas', 'upload']" class=""></font-awesome-icon>
									</p>
									<p>{{ $t('upload.label') }}</p>
								</div>
								</section>
							</b-upload>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			
		</div>
	</div>
</template>

<script>
import { toAttachmentAsync } from '../../models/Attachment'
import { isArray, isObject, isString } from 'lodash'

export default {
	props: {
		isEdit: {
			type: Boolean,
			default: false
		},

		attributes: {
			type: Array,
			default: () => []
		},

		type: {
			type: String,
			default: ''
		},

		projectId: {
			type: String,
			default: ''
		},

		value: {
			type: Array,
			default: () => []
		},

		tagsValueSet: {
			type: Array,
			default: () => []
		}
	},

	watch: {
		value(newValue) {
			this.attachments = (isArray(newValue)) ? newValue : [];
		}
	},

	data() {return {
		attachments: this.value,
		filteredTags : this.tagsValueSet
	}},

	computed: {
		processedAttachments() {
			if (!isArray(this.attachments))
				return [];

			return this.attachments.filter(e => e.type == this.type);
		},

		allTags() {
			let tags = this.tagsValueSet ?? [];
			this.attachments?.forEach(a => {
				if (isArray(a.tags))
					a.tags.forEach(t => {
						if (tags.indexOf(t) > -1)
							return;
						
						tags.push(t);
					});
			});

			return tags;
		}
	},

	methods: {
		updateFilteredTags(filter) {
			if (! isString(filter))
				return;
			filter = filter.toLowerCase();

			this.filteredTags = this.allTags?.filter(t => t?.toLowerCase().indexOf(filter) > -1) ?? [];
		},

		async onFileAttach(data) {
			if (! isArray(data) || data.length == 0)
				return;

			for (const file of data) {
				if (! (file instanceof File))
					continue;

				const att = await toAttachmentAsync(file, this.type, this.projectId);
				if (! isArray(this.attachments))
					this.attachments = [];

				this.attachments.push(att);
			}

			this.$emit('input', this.attachments);
		},

		onAttributeUpdate(attachment, attribute, ev) {
			if (! isArray(attachment.attributes))
				attachment.attributes = [];

			this.$set(attachment.attributes, attribute, event.target.value);
		},

		getAttachmentUrl(attachmentId) {
			let url = process.env.API_BASE_URL;
			return  url + '/api/attachments/' + attachmentId + '/content';
		},

		deleteAttachment(attachment) {
			if (! confirm(`Are you sure you want to delete [${attachment.name}]?`))
				return;

			const index = this.attachments.indexOf(attachment);
			this.attachments.splice(index, 1);
		}
	}
}
</script>

<style>

</style>