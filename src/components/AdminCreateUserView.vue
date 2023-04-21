<template>
	<div class="container">
		<h1 class="is-size-2">User administration</h1>
		<h2 class="subtitle is-size-3">Add new user</h2>
		<!-- <notifications :notifications="notifications"></notifications> -->
		<div class="level">
			<div class="card is-inline-block" :class="{'is-loading': isLoading && mode == 'search'}">
				<header class="card-header">
					<p class="card-header-title"><span class="tag is-primary is-medium has-text-right">1</span> Search for a Lanxess user</p>
				</header>
				<div class="card-content">
					<form @submit.prevent="searchUsersAsync()">
						<div class="card is-block">
							<div class="field has-addons">
								<div class="control">
									<input class="input" type="text" v-model="userSearchTerm" />
								</div>
								<div class="control">
									<button class="button" type="submit">Search</button>
								</div>
							</div>

						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="level">
			<div class="card" :class="{'is-disabled': mode != 'selectUser'}" :disabled="mode != 'selectUser'">
				<header class="card-header">
					<p class="card-header-title"><span class="tag is-medium is-primary has-text-right">2</span> Select a Lanxess user to create an application user</p>
				</header>
				<div class="card-content">
					<table class="table">
						<thead>
							<tr>
								<th>name</th>
								<th>username</th>
								<th>e-mail</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="user in userSearchResults">
								<td>{{user.lastName}}, {{user.firstName}}</td>
								<td>{{user.loginIdentifier}}</td>
								<td>{{user.email}}</td>
								<td><button @click="selectUserSearchResult(user)" class="button">create new application user from this LANXESS user</button></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="is-invisible">
			<form @submit.prevent="createNewUserAsync()">
				<div class="field">
					<label class="label">name</label>
					<div class="control">
						<input class="input" type="text" v-model="newUser.name" />
					</div>
				</div>
				<div class="field">
					<label class="label">username</label>
					<div class="control">
						<input class="input" type="text" v-model="newUser.loginIdentifier" />
					</div>
				</div>
				<div class="field">
					<label class="label">e-mail</label>
					<div class="control">
						<input class="input" type="text" v-model="newUser.email" />
					</div>
				</div>
				<div class="field">
					<div class="control">
						<button class="button" type="submit">create user</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
// import { Enumerable } from "arrgh"
// import notificationMixin from '../NotificationDisplayMixin'
// import UUID from 'uuidjs';
import { User } from '../models/User'
// import UserService from './UserService'



export default {
	// mixins: [notificationMixin],
	dependencies: [
		'searchActiveDirectoryUsersService',
		'saveUserService',
		'getUsersService'
	],

	data() {
		return  {
			userSearchResults: [],
			userSearchTerm: '',
			mode: 'search',
			isLoading: false,
			selectedUserSearchResult: {},
			newUser: new User()
		}
	},

	methods: {
		async searchUsersAsync() {
			try {
				this.isLoading = true;
				this.mode = 'search';
				this.userSearchResults = [];
				this.userSearchResults = await this.searchActiveDirectoryUsersService.searchAsync(this.userSearchTerm);
				this.mode = 'selectUser';
			}
			catch (e) {
				console.log("Error on searching AD users", e);
			}
			finally {
				this.isLoading = false;
			}
		},


		async selectUserSearchResult(userSearchResult) {
			// this.selectedUserSearchResult = userSearchResult;
			// this.newUser.name = userSearchResult.name;
			// this.newUser.email = userSearchResult.email;
			// this.newUser.loginIdentifier = userSearchResult.loginIdentifier;
			try {
				let user = new User();
				user.email = userSearchResult.email;
				user.loginIdentifier = userSearchResult.loginIdentifier;
				user.lastName = userSearchResult.lastName;
				user.firstName = userSearchResult.firstName;
				user.name = userSearchResult.lastName + ", " + userSearchResult.firstName;
				await this.saveUserService.saveAsync(user);
				let users = await this.getUsersService.getAsync();
				sessionStorage.removeItem('usersSave');
				let result = JSON.stringify(users)
				sessionStorage.setItem('usersSave', result);
				await this.$router.push({path: `/admin/users/${user.id}`});
			}
			catch(e) {
				console.log("Error on creating user", e);
			}
		}
	},

	async created() {
		// const userId = this.$route.params.id;
		// this.user = await this.userService.getByIdAsync(userId);
		// this.groups = await this.userService.getAllGroupsAsync();
		// this.isLoading = false;
	}


}
</script>
