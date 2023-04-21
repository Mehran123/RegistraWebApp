<template>
	<div class="container">
		<h1 class="title is-size-2">Manage Identifiers</h1>
		<h2 class="subtitle is-size-4">Identifiers</h2>
	
		<div class="level">
			<div class="level-left">
				<div class="level-item">
					<router-link :to="'/manageIdentifierCreateView'" class="button rounded is-primary is-outlined">add identifier</router-link>
				</div>
				<div class="level-right">
				<div class="level-item">
					<label class="label">filter</label>
				</div>
				<div class="level-item">
					<div class="field">

						<div class="control">
							<input type="text" class="input" v-debounce="300" v-model.lazy="filter"/>
						</div>
					</div>
				</div>
			</div>
			</div>
		
		</div>
		<b-table :data="processedIdenifierTpyes"
			:hoverable="true"
			:loading="isLoading"
			default-sort="name">
			<template >
				<b-table-column label="Identifier Name" sortable field="name" v-slot="props">
					{{props.row.name}}
				</b-table-column>
				
				
			</template>
		</b-table>
	</div>
</template>

<script>

import debounce from 'v-debounce'
import { map } from 'lodash'

export default {
	directives: {debounce},

	data() {
		return  {
			identifierTypes: [],
			isLoading: true,
			filter: ''
		}
	},

	dependencies: ['getIdentifierTypesService'],

	computed: {
		processedIdenifierTpyes() {
			if (! this.filter)
				return this.identifierTypes;

			const pattern = new RegExp(`${this.filter}`, 'gi');
			const checkMatch = (value) => {
				if (! value)
					return false;

				return value.match(pattern);
			};
			return this.identifierTypes.filter(e => checkMatch(e.name));
		}
	},

	methods: {
		showUserDetails(user) {
			this.$router.push({path: `/manageIdentifierCreateView`});
		}
	},

	async created() {
		try {
			this.identifierTypes = await this.getIdentifierTypesService.getAsync();
		}
		catch (e) {
			console.log("Error on initial loading Identifier types");
		}
		finally {
			this.isLoading = false;
		}
	}
}
</script>