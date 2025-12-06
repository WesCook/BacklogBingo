<script setup>
	import { useErrors } from '../composables/errors.js';
	import { validateJSON, detectDynamicCategory, parseDynamicCategory } from '../utils/json-parse.js';

	import CategoryListEvent from '../components/CategoryListEvent.vue';
	import ImportData from '../components/ImportData.vue';

	import IconPuzzle from '../components/icons/IconPuzzle.vue';
	import IconClipboardItems from '../components/icons/IconClipboardItems.vue';
	import IconWater from '../components/icons/IconWater.vue';
	import IconAbcBlocks from '../components/icons/IconAbcBlocks.vue';

	import listFluxJson from '../event-lists/flux.json';
	import listFlowJson from '../event-lists/flow.json';
	import listFormJson from '../event-lists/form.json';
	import listFreeJson from '../event-lists/free.json';

	const { setError } = useErrors();

	// Check for parsing errors, and tag any dynamic categories
	const listFlux = validateCategoryList(listFluxJson);
	const listFlow = validateCategoryList(listFlowJson);
	const listForm = validateCategoryList(listFormJson);
	const listFree = validateCategoryList(listFreeJson);

	// Parse, validate, and tag category lists with dynamic categories where needed
	// Returns clone with modifications (cat.dynamic = true)
	function validateCategoryList(jsonIn) {
		const json = structuredClone(jsonIn);

		// Validate schema
		const valid = validateJSON(json, 'category-list');
		if (!valid) return;

		// Separately validate and tag dynamic categories
		const errors = [];
		for (const cat of json.categories) {
			if (detectDynamicCategory(cat.name)) {
				cat.dynamic = true;
				const { errors } = parseDynamicCategory(cat.name);
				if (errors.length) {
					errors.push(...errors);
				}
			}
		}
		if (errors.length) {
			setError(errors.join('\n\n'));
			return;
		}

		return json;
	}
</script>

<template>
	<nav class="nav-bar">
		<h1>Backlog Bingo</h1>
		<ImportData />
	</nav>

	<p>Let's get started!  Which style of bingo card suits you best?</p>

	<ul class="category-lists">
		<CategoryListEvent
			:json="listFlux"
			:icon="IconClipboardItems"
			color="var(--tone4)"
		/>
		<CategoryListEvent
			:json="listFlow"
			:icon="IconWater"
			color="var(--tone1)"
		/>
		<CategoryListEvent
			:json="listForm"
			:icon="IconPuzzle"
			color="var(--tone2)"
		/>
		<CategoryListEvent
			:json="listFree"
			:icon="IconAbcBlocks"
			color="var(--tone3)"
		/>
	</ul>
</template>

<style scoped>
	.category-lists {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin-top: 1rem;
		padding: 1.5em;
		gap: 1.5em;
		background-color: var(--background-shaded);
		border: 1px solid var(--border-color);
		list-style: none; /* Remove native list styling */

		/* Mobile responsiveness */
		@media (max-width: 800px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (max-width: 520px) {
			grid-template-columns: 1fr;
		}
	}
</style>
