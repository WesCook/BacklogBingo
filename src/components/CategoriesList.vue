<script setup>
	import { useCategories } from '../composables/categories.js';

	const { getCardSource } = useCategories();
	defineProps({
		categories: {
			type: Array,
			default: () => []
		}
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
				<span>{{ category.name }}</span>
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
		background-color: color-mix(in srgb, var(--background-shaded) 90%, var(--foreground-color));
	}
	@media (min-width: 700px) {
		.list {
			columns: 2;
			column-gap: 24px;
		}
	}
</style>
