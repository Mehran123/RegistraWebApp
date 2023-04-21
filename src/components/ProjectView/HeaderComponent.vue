<template>
	<div class="block">
		<div class="box mb-2">
			<div class="columns ">
				<div class="column">
					<label class="label is-small">{{ $t('project.area.label') }}</label>
					{{$get(project,'area.name')}}
				</div>
				<div class="column">
					<label class="label is-small">{{ $t('project.targetLegislationStatus.label') }}</label>
					<legislation-status v-model="project.targetLegislationStatus"> </legislation-status>
				</div>
				<div class="column">
					<label class="label is-small">{{ $t('project.deadline.label') }}</label>
					<input-date-rw v-model="project.deadline"></input-date-rw>
				</div>
				<div class="column" v-if="hasIdentifierCas">
					<label class="label is-small">CAS</label>
					{{identifierCas}}
				</div>
				<div class="column"  v-if="hasIdentifierEc">
					<label class="label is-small">EC</label>
					{{identifierEc}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	dependencies: ['identifierValueService'],

	props: {
		project: {

		}
	},

	computed: {
		hasIdentifierCas() {
			return this.identifierValueService.hasIdentifier(this.project?.substance?.identifiers, 'cas');
		},

		identifierCas() {
			return this.identifierValueService.getIdentifierValue(this.project?.substance?.identifiers, 'cas');
		},

		hasIdentifierEc() {
			return this.identifierValueService.hasIdentifier(this.project?.substance?.identifiers, 'ec');
		},

		identifierEc() {
			return this.identifierValueService.getIdentifierValue(this.project?.substance?.identifiers, 'ec');
		}

	}
};
</script>

