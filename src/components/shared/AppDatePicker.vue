<template>
	<v-menu v-model="show" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
		<template v-slot:activator="{ on }">
			<v-text-field v-model="date" :label="label" class="pt-0" prepend-inner-icon="event" readonly v-on="on" />
		</template>
		<v-date-picker v-model="date" @input="input" />
	</v-menu>
</template>

<script>
	export default {
		props: {
			value: {
				type: String,
				required: true,
				default: ''
			},

			label: {
				type: String,
				required: true,
				default: ''
			}
		},

		data() {
			return {
				date: this.value,
				show: false
			};
		},

		methods: {
			input() {
				this.$emit('input', this.date);
				this.show = false;
			}
		}
	};
</script>

<style lang="scss" scoped></style>
