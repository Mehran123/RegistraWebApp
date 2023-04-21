<template>
	<section class="authority-uploader w-100 mt-1">
		<b-upload v-model="dropFiles" class="w-100" accept=".pdf" multiple drag-drop @input="onDrop">
			<section class="section w-100">
				<div class="content has-text-centered">
					<p>
						<b-icon icon="upload" size="is-large"> </b-icon>
					</p>
					<p>Drop your files here or click to upload</p>
				</div>
			</section>
		</b-upload>

		<div class="tags mt-1">
			<span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
				{{ file.name }}
				<button class="delete is-small" type="button" @click="deleteDropFile(index)"></button>
			</span>
		</div>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				dropFiles: []
			};
		},

		methods: {
			onDrop(newFiles) {
				console.log({
					newFiles
				});
				this.$emit('drop', newFiles);
			},

			deleteDropFile(index) {
				this.dropFiles.splice(index, 1);
			}
		}
	};
</script>

<style lang="scss">
	.authority-uploader {
		.upload-draggable {
			width: 100%;
		}
	}
</style>
