<script setup>
	import { useCategories } from '../composables/categories.js';

	const { getCardSourceGroups } = useCategories();

	defineProps({
		colors: {
			type: Object,
			default: () => {}
		}
	});

	const model = defineModel({ type: Array });

	const groups = getCardSourceGroups();

	function pascalToTitleCase(input) {
		const result = input.replace(/([A-Z])/g, ' $1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}
</script>

<template>
	<div
		v-if="groups.length"
		class="quick-toggle"
	>
		<strong>Quick Toggle</strong>
		<ul>
			<li
				v-for="group in groups"
				:key="group"
			>
				<label>
					<input
						v-model="model"
						type="checkbox"
						checked="checked"
						:value="group"
						@click="toggleGroup"
					>
					<span
						:style="{ color: colors[group] }"
					>{{ pascalToTitleCase(group) }}</span>
				</label>
			</li>
		</ul>
	</div>
</template>

<style scoped>
	.quick-toggle {
		display: flex;
		gap: 1em;
	}
	strong {
		white-space: nowrap;
	}
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		column-gap: 1em;
	}
	label {
		white-space: nowrap;
	}
</style>
