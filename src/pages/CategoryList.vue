<script setup>
	import CategoryListEvent from '../components/CategoryListEvent.vue';
	import ImportData from '../components/ImportData.vue';
	import { markDynamicCategories } from '../utils/file-import.js';

	import IconClipboardItems from '../components/icons/IconClipboardItems.vue';
	import IconWater from '../components/icons/IconWater.vue';
	import IconPuzzle from '../components/icons/IconPuzzle.vue';
	import IconAbcBlocks from '../components/icons/IconAbcBlocks.vue';

	import listFlux from '../event-lists/flux.json';
	import listFlow from '../event-lists/flow.json';
	import listForm from '../event-lists/form.json';
	import listFree from '../event-lists/free.json';

	// Mark any dynamic categories for future use
	const listFluxMarked = markDynamicCategories(listFlux);
	const listFlowMarked = markDynamicCategories(listFlow);
	const listFormMarked = markDynamicCategories(listForm);
	const listFreeMarked = markDynamicCategories(listFree);
</script>

<template>
	<nav class="nav-bar">
		<h1>Backlog Bingo</h1>
		<ImportData />
	</nav>

	<p>Let's get started!  Which style of bingo card suits you best?</p>

	<ul class="category-lists">
		<CategoryListEvent
			:json="listFluxMarked"
			:icon="IconClipboardItems"
			color="var(--tone4)"
		/>
		<CategoryListEvent
			:json="listFlowMarked"
			:icon="IconWater"
			color="var(--tone1)"
		/>
		<CategoryListEvent
			:json="listFormMarked"
			:icon="IconPuzzle"
			color="var(--tone2)"
		/>
		<CategoryListEvent
			:json="listFreeMarked"
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
