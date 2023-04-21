<template>
	<div :class="{'columns is-centered': isNarrow}">
		<div :class="{'column': isWide || isBorderless, 'container': !isWide && !isNarrow && !isBorderless, 'column is-one-third': isNarrow}">
			<div class="pt-2 pb-3">
				<h1 class="title">
					<slot name="title"></slot>
				</h1>
				<h2 class="subtitle">
					<slot name="subtitle"></slot>
				</h2>
			</div>

			<slot name="beforeContent"></slot>
			<slot></slot>
			<slot name="afterContent" ></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		isWide: {
			type: Boolean,
			default: false
		},

		isNarrow: {
			type: Boolean,
			default: false
		},
		isBorderless: {
			type: Boolean,
			default: false
		}
	}
};
</script>
