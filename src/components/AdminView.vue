<template>
	<!-- <template v-if="loading.general" #subtitle>
		<b-progress class="pt-3" size="is-small" type="is-primary"></b-progress>
	</template>
	<template v-else #subtitle>{{ project.name }}</template> -->
	<div class="container">
		<div class="tile-flexrow">
			<router-link class="tile-big" :to="'/admin/users'" >
				<font-awesome-icon :icon="['fas', 'users']" class="tile-icon"></font-awesome-icon>
				<p>Users</p>
			</router-link>
			<router-link class="tile-big" :to="'/manageidentiers'" >
				<font-awesome-icon :icon="['fas', 'plus']" class="tile-icon"></font-awesome-icon>
				<p>identifiers</p>
			</router-link>
		</div>
	</div>
</template>

<script>
export default {

};
</script>

<style scoped>

</style>
