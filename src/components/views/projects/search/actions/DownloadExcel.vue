<template>
	<v-dialog v-model="dialog" scrollable persistent max-width="600px">
		<template v-slot:activator="{ on }">
			<v-btn color="success" outlined icon-left :loading="loading" v-on="on">
				<v-icon>
					mdi-file-excel
				</v-icon>
				Excel
			</v-btn>
		</template>
		<v-card class="card-save-search">
			<v-card-title class="title blue lighten-2 white--text">
				Save to Excel
			</v-card-title>
			<v-card-text>
				<v-text-field v-model="fileName" class="pt-2" label="Enter file name" dense @keydown.enter="download" />
			</v-card-text>
			<v-divider class="my-1" />
			<v-card-actions class="py-3">
				<v-row class="px-4" justify="end">
					<v-btn color="grey darken-1" class="mr-3" small dark @click="dialog = false">
						Close
					</v-btn>
					<v-btn color="success" icon-left small :loading="loading" @click="download"> <v-icon left> mdi-content-save </v-icon>Save </v-btn>
				</v-row>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
	import { mapActions } from 'vuex';
	import XLSX from 'xlsx';
	import { forEach, map, size } from 'lodash';
	import { get } from 'lodash/fp';

	export default {
		data() {
			return {
				loading: false,
				dialog: false,
				fileName: ''
			};
		},

		methods: {
			...mapActions('projects', ['loadDataToSave']),

			download() {
				this.loading = true;
				this.loadDataToSave()
					.then(data => {
						data = this.transformContent(data);
						const ws = XLSX.utils.aoa_to_sheet(data);
						ws['!cols'] = map(data[0], val => ({ wch: size(val) + 20 }));
						const wb = XLSX.utils.book_new();
						XLSX.utils.book_append_sheet(wb, ws, 'Registra');
						XLSX.writeFile(wb, `${this.fileName || 'projects-report'}.xlsx`);
						this.clear();
					})
					.finally(() => {
						this.loading = false;
					});
			},

			transformContent({ columns, content }) {
				const headers = map(columns, get('value'));
				let data = [headers];

				forEach(content, row => {
					let rowData = [];
					forEach(columns, header => {
						const value = row[header.key] ? row[header.key] : null;
						rowData = [...rowData, value];
					});

					data = [...data, rowData];
				});

				return data;
			},

			clear() {
				this.fileName = '';
				this.dialog = false;
			}
		}
	};
</script>

<style scoped>
	.card-save-search {
		overflow-x: hidden;
	}
</style>
