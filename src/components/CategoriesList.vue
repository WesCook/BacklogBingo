<script setup>
	import { useCategories } from '../composables/categories.js';
	import { generateHSL } from '../utils/color-utils.js';

	const { getCardSource, getCardSourceGroups } = useCategories();

	defineProps({
		categories: {
			type: Array,
			default: () => []
		}
	});

	// Generate colors to be assigned in template
	const groups = getCardSourceGroups();
	const colors = generateHSL(groups.length, 50, 50);
	const groupColors = {};
	groups.forEach((group, index) => {
		groupColors[group] = colors[index];
	});
</script>

<template>
	<ul class="list">
		<li
			v-for="category in getCardSource().categories"
			:key="category.name"
		>
			<label>
				<input
					type="checkbox"
					checked="checked"
				>
				<span
					:style="{ color: groupColors[category.group] }"
				>{{ category.name }}</span>
			</label>
		</li>
	</ul>
</template>

<style scoped>
	.list {
		min-height: 200px;
		list-style: none;
		padding: 15px;
		border: 1px solid var(--border-color);
		background-color: color-mix(in srgb, var(--background-shaded) 92%, var(--foreground-color));
	}
	@media (min-width: 700px) {
		.list {
			columns: 2;
			column-gap: 24px;
		}
	}
</style>
