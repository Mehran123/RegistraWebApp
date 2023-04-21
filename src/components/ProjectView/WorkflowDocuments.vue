<template>
	<div class="workflow-documents">
		<b-table class="workflow-documents__table" :data="data" :columns="columns"> </b-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				columns: [
					{
						field: 'id',
						label: '',
						width: '40',
						numeric: true
					},
					{
						field: 'submission-no',
						label: 'Submission No'
					},
					{
						field: 'reason',
						label: 'Reason'
					}
				]
			};
		}
	};
</script>

<style lang="scss">
	.workflow-documents {
		border: 1px solid #dbdbdb;
		border-radius: 4px;

		&__table {
			.table {
				min-height: 220px;
			}
		}
	}
</style>
