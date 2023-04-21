<template>
	<div class="app-select-multiple">
		<div class="app-select-multiple__list">
			<div v-for="item in localData" :key="item.id" class="app-select-multiple__option" :class="{ selected: item.selected }" @click="toggle(item.id)">
				{{ item[displayValueField] }}
			</div>
		</div>
	</div>
</template>

<script>
	import { filter, map } from 'lodash';

	export default {
		props: {
			data: {
				type: Array,
				default: () => []
			},

			selectedValueField: {
				type: String,
				default: ''
			},

			displayValueField: {
				type: String,
				default: 'name'
			}
		},

		data() {
			return {
				localData: []
			};
		},

		watch: {
			data: {
				handler(newValue) {
					if (!Array.isArray(newValue)) {
						return;
					}

					this.localData = map(this.data, item => ({
						...item,
						selected: false
					}));
				},
				immediate: true
			}
		},

		methods: {
			toggle(id) {
				this.localData = map(this.localData, item => {
					if (id === item.id) {
						item.selected = !item.selected;
					}

					return item;
				});

				this.emitValue();
			},

			emitValue() {
				let selected = filter(this.localData, 'selected');
				selected = this.selectedValueField ? map(selected, item => item[this.selectedValueField]) : selected;

				this.$emit('input', selected);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-select-multiple {
		background-color: white;
		border: 1px solid #dbdbdb;
		border-radius: 4px;
		color: #363636;
		box-sizing: border-box;
		clear: both;
		font-size: 1rem;
		position: relative;
		text-align: left;
		height: 100%;
		overflow: hidden;

		&:hover {
			border-color: #b5b5b5;
		}

		&__list {
			height: 100%;
			max-height: 160px;
			overflow-y: auto;
		}

		&__option {
			padding: 0.5em 1em;
			color: #4a4a4a;
			cursor: pointer;

			&.selected {
				background-color: rgb(206, 206, 206);
			}
		}
	}
</style>
