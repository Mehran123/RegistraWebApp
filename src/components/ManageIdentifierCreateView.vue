<template>
	<div class="container">
		<h1 class="is-size-2">Mange Identifier</h1>
		<h2 class="subtitle is-size-3">Add new identifier</h2>
		<div class="level">
			<div class="card is-inline-block" :class="{'is-loading': isLoading }">
				<div class="card-content">
					<!-- <form @submit.prevent="saveIdentifierTypeAsync()"> -->
						<div class="card is-block">
							<div class="field has-addons">
								<div class="control">
									<input type="text" v-model="newIdentifierType.name" @input="inputChange(newIdentifierType.name)"  class="input" />
								</div>
								<div class="control"> 
									<button @click="saveIdentifierTypeAsync()" :disabled="!canCreate" class="button rounded is-primary is-outlined" type="submit">Save</button>
									<button @click="$router.go(-1)" class="button rounded is-primary is-outlined">
										<span>back</span>
										</button>
								</div>
							</div>
						</div>
					<!-- </form> -->
				</div>
			</div>
		</div>
	
	
	</div>
</template>
<script>

import { IdentifierType } from '../models/IdentifierType'

export default {
	dependencies: [
		'saveIdentifierTypesService'
	],

	data() {
		return  {
			isLoading: false,
			newIdentifierType: new IdentifierType(),
            canCreate:false
		}
	},

	methods: {
		inputChange(val){
				this.canCreate = val.length > 1 ? true: false;	
		},
		async saveIdentifierTypeAsync() {
			try {
				this.isLoading = true;
				let bb = this.newIdentifierType;
				if(this.newIdentifierType.name.length>0)
				{
					await this.saveIdentifierTypesService.saveAsync(this.newIdentifierType);
					this.$buefy.snackbar.open("Identifier key save successfully");
				}
			}
			catch (e) {
				this.$buefy.snackbar.open("Error on Identifier key");
				console.log("Error on Identifier key", e);
			}
			finally {
				this.isLoading = false;
			}
		},		
	},



}
</script>
