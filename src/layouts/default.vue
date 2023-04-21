<template>
	<div id="app">
		<app-navbar />
		<div>
			<div>
				<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
					<nuxt keep-alive />
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import AppNavbar from '~/components/layout/AppNavbar';

	export default {
		components: {
			AppNavbar
		},

		data() {
			return {};
		}
	};
</script>

<style lang="scss">
	.page-container {
		width: 100vw;

		&.v-content__wrap {
			width: 100vw;
		}
	}

	.v-content {
		&__wrap {
			width: 100%;
		}
	}
</style>
