<template>
	<div class="container">
		<h3 class="is-size-2">User administration</h3>
		<!-- <notifications :notifications="notifications"></notifications> -->
		<div :class="{'is-loading': isLoading}">
			<h4 class="is-size-3">{{user.name}}</h4>
			<div class="card is-block is-">
				<div class="card-content">
					<h5 class="title is-size-4">Groups</h5>
					<div v-if="mode != 'addGroup'">
						<button @click="activateMode('addGroup')" class="button">
							<span class="icon is-medium"><i class="fas fa-user-plus"></i></span>
							<span>add user to a group</span>
						</button>
					</div>
					<div v-if="mode == 'addGroup'">
						<div class="select">
							<select v-model="group">
								<option v-for="g in processedUnassignedGroups" :key="g.id" :value="g">{{g.name}}</option>
							</select>
						</div>
						<button @click="addGroupAsync" class="button">
							<span class="icon is-medium"><i class="fas fa-user-plus"></i></span>
							<span>add user to {{group ? group.name : ''}}</span>
						</button>
					</div>
					<table class="table">
						<thead>
							<tr>
								<th>Group name</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="group in user.groups">
								<td>{{group.name}}</td>
								<td>
									<button @click="removeGroupAsync(group)" class="button">
										<span class="icon is-medium"><i class="fas fa-user-minus"></i></span>
										<span>remove from {{group.name}}</span>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<h5 class="title is-size-4">Claims</h5>
					<b-tabs>
						<b-tab-item label="Area">
						<table class="table">
						<tbody>
							<tr v-for="area in areas">
								<td>{{ area.name }}</td>
								<td>
									<b-radio :name="area.code" :value="getUsersAreaValue(area)" :native-value="null" @input="changeUsersAreaValueAsync(area, 'none')">No Access</b-radio>
									<b-radio :name="area.code" :value="getUsersAreaValue(area)" native-value="read" @input="changeUsersAreaValueAsync(area, 'read')">Read Only</b-radio>
									<b-radio :name="area.code" :value="getUsersAreaValue(area)" native-value="write" @input="changeUsersAreaValueAsync(area, 'write')">Contributer</b-radio>
									<b-radio :name="area.code" :value="getUsersAreaValue(area)" native-value="manage" @input="changeUsersAreaValueAsync(area, 'manage')">Manager</b-radio>
								</td>
							</tr>
						</tbody>
						</table>
					</b-tab-item>
						<b-tab-item label="Business Unit">
						<table class="table">
							<tbody>
								<tr v-for="bu in businessUnits">
									<td>Has acces to data of BU <b>{{ bu.abbreviation }}</b></td>
									<b-switch  size="is-medium" :value="hasAccessToBuData(bu)"  @input="toggleAccessToBuDataAsync(bu)"></b-switch>
								</tr>
							</tbody>
						</table>		
					</b-tab-item>
					</b-tabs>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
// import { Enumerable } from "arrgh"
// import notificationMixin from '../NotificationDisplayMixin'
import { isArray, isNil } from 'lodash'

export default {
	// mixins: [notificationMixin],

	data() {
		return  {
			user: {},
			groups: [],
			isLoading: true,
			mode: '',
			notifications:[],
			group: {},
			// isUserLimitedToBuData: true,
			hasAccessBuLea: false,
			bus:['AII', 'IPG', 'HPM', 'LUP', 'TSR', 'HPE', 'SGO', 'LEA', 'RCH', 'LPT', 'URE', 'ADD', 'MPP', 'INN', 'LXD'],
			areas: [],
			businessUnits : []
		}
	},

	// inject: ['userService', 'generalApiService'],
	dependencies: [
		'getUserService',
		'saveUserService',
		'getAreasService',
		'checkClaimsService',
		'removeUserClaimService',
		'addUserClaimService', 
		'claimValueService',
		'getUserGroupsService',
		'removeUserFromGroupService',
		'addUserToGroupService',
		'getBusinessUnitsService',
	],

	computed: {
		processedUnassignedGroups() {
			if (!isArray(this.groups))
				return [];

			return this.groups.filter(e => !(this.user.groups && this.user.groups.findIndex(f => f.id == e.id) >= 0));
		}
	},

	methods: {
		getUsersAreaValue(area) {
			sessionStorage.removeItem("currentUser");
			sessionStorage.removeItem("usersSave");
			return this.checkClaimsService.getAreaPermission(this.user, area);
		},

		async changeUsersAreaValueAsync(area, newValue) {
			this.isLoading = true;
			sessionStorage.removeItem("currentUser");
			sessionStorage.removeItem("usersSave");
			console.log(area, newValue);
			const existingClaim = this.checkClaimsService.getAreaClaim(this.user, area);
			if (existingClaim != null) {
				await this.removeUserClaimService.removeAsync(this.user.id, existingClaim.type, existingClaim.value);
			}
			if (newValue != 'none') {
				const value = this.claimValueService.generateAreaClaimValue(area, newValue);
				await this.addUserClaimService.addAsync(this.user.id, 'Area Permission', value);
			}
			await this.refreshUserAsync();
			this.isLoading = false;
		},
	
		hasAccessToBuData(buId) {
			return this.user.claims && this.user.claims.findIndex(e => e.type == 'BusinessUnit' && e.value == buId.abbreviation) > -1
		},
		async toggleAccessToBuDataAsync(bu) {
			const abbreviation = bu.abbreviation;
			sessionStorage.removeItem("currentUser");
			sessionStorage.removeItem("usersSave");
			if (this.hasAccessToBuData(bu)) {
				console.log("remove");
				await this.removeUserClaimService.removeAsync(this.user.id,  'BusinessUnit', abbreviation);
			}
			else {
				console.log("add");
				await this.addUserClaimService.addAsync(this.user.id, 'BusinessUnit', abbreviation);
			}

			await this.refreshUserAsync();
		},
			onNoteTypeChange(note, value) {
			if (value)
				note.type = NoteType.Task;
			else
				note.type = NoteType.Note;
		},
		groupsToHuman(groups) {
			if (! isArray(groups))
				return '';
			return new Enumerable(groups).select(e => e.name).toArray().join(', ');
		},

		activateMode(mode) {
			this.mode = mode;
		},

		async addGroupAsync() {
			if (isNil(this.group))
				return;

			this.isLoading = true;
             let us = this.user;
			 let gro = this.group;
			try {
				// sessionStorage.removeItem("currentUser");
				// sessionStorage.removeItem("userSave");
				await this.addUserToGroupService.addAsync(this.user.id, this.group.id);
				sessionStorage.removeItem("currentUser");
				sessionStorage.removeItem("userSave");
				await this.refreshUserAsync();
				// this.addSuccess(`Added ${this.user.name} successfully to group ${this.group.name}`);
			}
			catch(e) {
				console.log("Error occured during adding the user to a group", e, this.user, this.group);
				// this.addError(`Error on adding  ${this.user.name} to group ${this.group.name}`);
			}
			finally {
				this.isLoading = false;
			}

		},

		async removeGroupAsync(group) {
			if (isNil(group))
				return;

			this.isLoading = true;
			try {
				sessionStorage.removeItem("currentUser");
				sessionStorage.removeItem("userSave");
				await this.removeUserFromGroupService.removeAsync(this.user.id, group.id);
				await this.refreshUserAsync();
				// this.addSuccess(`Removed ${this.user.name} successfully from group ${group.name}`);
			}
			catch (e) {
				console.log("Error occured during removing the user from group", e, this.user, group);
				// this.addError(`Error on removing  ${this.user.name} from group ${group.name}`);
			}
			finally {
				this.isLoading = false;
			}
		},

		async refreshUserAsync() {
			let user = this.user.id;
			this.user = await this.getUserService.getAsync(this.user.id);
		},

		

		// async toggleAccessToBuDataAsync(buId) {
		// 	if (this.hasAccessToBuData(buId)) {
		// 		console.log("remove");
		// 		await this.userService.removeClaimFromUserAsync(this.user.id, "BusinessUnit", buId);
		// 	}
		// 	else {
		// 		console.log("add");
		// 		await this.userService.addClaimToUserAsync(this.user.id, "BusinessUnit", buId);
		// 	}

		// 	await this.refreshUserAsync();
		// }
	},

	async created() {
		const userId = this.$route.params.id;
		try {
			this.user = await this.getUserService.getAsync(userId);
			let user = this.user;
			this.areas = await this.getAreasService.getAsync();
			this.groups = await this.getUserGroupsService.getAsync();
			this.businessUnits = await this.getBusinessUnitsService.getAsync();

		}
		catch (e) {
			console.error('Error on loading user admin data', e);
		}
		finally
		{
			this.isLoading = false;
		}
	}


}
</script>
