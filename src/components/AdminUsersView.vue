<template>
	<div class="container">
		<h1 class="title is-size-2">User administration</h1>
		<h2 class="subtitle is-size-4">Users</h2>
		<!-- <div class="is-inline-block" :class="{'is-loading': isLoading}" >

			<table class="table is-hoverable" v-show="false">
				<thead>
					<tr>
						<th>username</th>
						<th>name</th>
						<th>e-mail</th>
						<th>groups</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="user in users" :key="user.id" @click="showUserDetails(user)" class="is-interactive">
						<td><router-link :to="'/admin/users/' + user.id">{{user.loginIdentifier}}</router-link></td>
						<td>{{user.name}}</td>
						<td>{{user.email}}</td>
						<td>{{groupsToHuman(user.groups)}}</td>
					</tr>
				</tbody>
			</table>
		</div> -->
		<div class="level">
			<div class="level-left">
				<div class="level-item">
					<router-link :to="'/admin/users/add'" class="button">add user</router-link>
				</div>
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
		<b-table :data="processedUsers"
			@select="showUserDetails"
			:hoverable="true"
			:loading="isLoading"
			default-sort="name">
			<template >
				<b-table-column label="username" sortable field="loginIdentifier" v-slot="props">
					{{props.row.loginIdentifier}}
				</b-table-column>
				<b-table-column label="name" sortable field="name" v-slot="props">
					{{props.row.name}}
				</b-table-column>
				<b-table-column label="e-mail" sortable field="email" v-slot="props">
					{{props.row.email}}
				</b-table-column>
				<b-table-column label="groups" v-slot="props">
					{{groupsToHuman(props.row.groups)}}
				</b-table-column>
			</template>
		</b-table>
	</div>
</template>
<script>
// import { Enumerable } from "arrgh"
import debounce from 'v-debounce'
import { map } from 'lodash'

export default {
	directives: {debounce},

	data() {
		return  {
			users: [],
			isLoading: true,
			filter: ''
		}
	},

	dependencies: ['getUsersService'],

	computed: {
		processedUsers() {
			if (! this.filter)
				return this.users;

			sessionStorage.removeItem("usersSave");
			const pattern = new RegExp(`${this.filter}`, 'gi');
			const checkMatch = (value) => {
				if (! value)
					return false;

				return value.match(pattern);
			};
			return this.users.filter(e => checkMatch(e.name) || checkMatch(e.loginIdentifier) || checkMatch(e.email));
		}
	},

	methods: {
		groupsToHuman(groups) {
			return map(groups, 'name')?.join(', ');
			// return new Enumerable(groups).select(e => e.name).toArray().join(', ');
		},

		showUserDetails(user) {
			this.$router.push({path: `/admin/users/${user.id}`});
		}
	},

	async created() {
		try {
			this.users = await this.getUsersService.getAsync();
		}
		catch (e) {
			console.log("Error on initial loading users");
		}
		finally {
			this.isLoading = false;
		}
	}
}
</script>
