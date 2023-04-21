<template>
	<div class="column">
		<h1 v-if="$slots.title" class="title is-3">
			<slot name="title" />
		</h1>
		<h1 v-if="$slots.subtitle" class="subtitle is-5">
			<slot name="subtitle" />
		</h1>
		<slot />
	</div>
</template>

<script>
	export default {};
</script>

<style lang="scss" scoped></style>
