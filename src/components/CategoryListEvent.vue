<script setup>
	const props = defineProps({
		// Valid category list json
		json: {
			type: Object,
			required: true
		},
		// SVG icon component
		icon: {
			type: Object,
			required: true
		},
		// CSS color or custom property
		color: {
			type: String,
			default: 'black'
		}
	});
</script>

<template>
	<li
		class="category-list"
		:style="{ '--custom-color': color }"
	>
		<h2>{{ json.name }}</h2>

		<div class="icon">
			<component
				:is="icon"
				size="120"
			/>
		</div>

		<button>Preview</button>
		<button>Select</button>

		<p>{{ json.description }}</p>
	</li>
</template>

<style scoped>
	.category-list {
		padding: 0.8em;
		text-align: center;
		background-color: color-mix(in srgb, var(--background-color) 40%, var(--custom-color));
		transition: background-color 100ms ease;

		&:hover,
		&:focus-within {
			background-color: color-mix(in srgb, var(--background-color) 10%, var(--custom-color));
		}

		.icon {
			margin: 0 auto;
			margin-bottom: 0.8em;
		}

		button {
			margin: 4px;
		}
	}
</style>
