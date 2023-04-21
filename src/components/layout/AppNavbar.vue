<template>
	<div>
		<nav class="navbar is-dark no-print">
			<div class="navbar-brand"></div>
			<div class="navbar-start">
				<router-link class="navbar-item" to="/projects">Home</router-link>
				<router-link class="navbar-item" to="/projects/create-project">Create Project</router-link>
				<router-link class="navbar-item" to="/legalStatus">Legal Status</router-link>
				<!-- <router-link class="navbar-item" : to="'/reports'">Reports</router-link> -->
				<!-- <router-link v-if="canImpactAnalysis" class="navbar-item" : to="'/reports/impact'">Impact reports</router-link> -->
				<!-- <router-link v-if="canStandardAnalysis" class="navbar-item" : to="'/reports/standard'">Standard reports</router-link> -->
				<!-- <router-link v-if="canDossierAnalysis" class="navbar-item" : to="'/reports/dossier'">Dossier reports</router-link> -->
			</div>
			<div class="navbar-end">
				<div class="navbar-item" @click="isVersioninfoActive = true">V. {{ appVersion }}</div>
			</div>
		</nav>
		<b-modal :active.sync="isVersionInfoActive">
			<div class="card">
				<div class="card-content">
					<div class="content">
						{{ versionInfoContent }}
					</div>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				appVersion: process.env.appVersion,
				isVersionInfoActive: false,
				versionInfoContent: ''
			};
		},

		methods: {
			goToPage({ to }) {
				this.$router.push(to);
			}
		}
	};
</script>

<style lang="scss" scoped></style>
