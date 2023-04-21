<template>
	<div class="w-100">
		<h1 v-if="error.statusCode === 404" class="headline text-center">
			Page not found
		</h1>
		<h1 v-else class="headline text-center">
			An error occurred
		</h1>
	</div>
</template>

<script>
	export default {
		props: ['error'],

		data() {
			return {};
		}
	};
</script>

<style lang="scss">
	.w-100 {
		width: 100%;
	}
</style>
