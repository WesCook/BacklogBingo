<script setup>
	import { ref, computed, toRaw } from 'vue';
	import { useRouter } from 'vue-router';

	import { useErrors } from '../composables/errors.js';
	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';
	import { validateJSON, detectDynamicCategory, parseDynamicCategory } from '../utils/json-parse.js';

	import CategoryListEvent from '../components/CategoryListEvent.vue';
	import CategoryListPreview from '../components/CategoryListPreview.vue';
	import ImportData from '../components/ImportData.vue';
	import IconPuzzle from '../components/icons/IconPuzzle.vue';
	import IconClipboardItems from '../components/icons/IconClipboardItems.vue';
	import IconWater from '../components/icons/IconWater.vue';
	import IconAbcBlocks from '../components/icons/IconAbcBlocks.vue';

	const router = useRouter();
	const { clearGameRules, setGameRule, resetGameRules } = useGameRules();
	const { getCategoryList, setCategoryList, isCategoryListSet, shouldShrinkGrid } = useCategories();
	const { setBingoCard } = useBingo();
	const { clearError, setError } = useErrors();

	const jsonData = ref();
	const jsonType = ref();

	// If we're returning from another page, load the stored json and clear any set game rules
	if (isCategoryListSet.value) {
		const json = structuredClone(toRaw(getCategoryList())); // Do not want reactive variable, since jsonData is just for local staging
		jsonData.value = json;
		jsonType.value = determineType(json);
		clearGameRules();
	}

	// Loading categories list or imported card
	function loadFile(json) {
		jsonType.value = determineType(json);

		// Then validate against appropriate schema
		const valid = validateJSON(json, jsonType.value);
		if (!valid) {
			jsonType.value = '';
			return;
		}

		// Separately validate dynamic categories
		if (jsonType.value === 'category-list') {
			const allErrors = [];
			for (const cat of json.categories) {
				if (detectDynamicCategory(cat.name)) {
					cat.dynamic = true;
					const { errors } = parseDynamicCategory(cat.name);
					if (errors.length) {
						allErrors.push(...errors);
					}
				}
			}
			if (allErrors.length) {
				setError(allErrors.join('\n\n'));
				return;
			}
		}

		// Data looks good, so let's clear any old errors
		clearError();
	}

	// Determine if we're dealing with a category list or export from JSON
	function determineType(json) {
		if (Object.hasOwn(json, 'exported')) { // Has key "exported", must be Bingo Import
			return 'bingo-import';
		} else {
			return 'category-list';
		}
	}

	// Update categories and move to next page (settings)
	function confirmList() {
		clearError();
		setCategoryList(jsonData.value);
		router.push('/settings');
	}

	// Update bingo card and load bingo page
	function confirmImport() {
		clearError();

		// Update bingo card categories
		setBingoCard({
			name: jsonData.value.name,
			categories: jsonData.value.categories,
		});

		// Update gamerules - Start with standard, then apply overrides
		// This way, adding new game rules won't invalidate the schema
		resetGameRules('standard', false, shouldShrinkGrid());
		Object.entries(jsonData.value.gamerules).forEach(([rule, value]) => {
			setGameRule(rule, value);
		});

		// Play bingo!
		router.push('/bingo');
	}

	// Confirm button
	const confirmButtonLabel = computed(() =>
		jsonType.value === 'bingo-import' ? 'Import Card' : 'Confirm List'
	);

	function submitConfirm() {
		if (jsonType.value === 'bingo-import') {
			confirmImport();
		} else {
			confirmList();
		}
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
			title="Flux"
			file="tildes-gaming-2025-may-flux.json"
			:icon="IconClipboardItems"
			color="var(--tone4)"
			@load-file="loadFile"
		/>
		<CategoryListEvent
			title="Flow"
			file="tildes-gaming-2025-may-flow.json"
			:icon="IconWater"
			color="var(--tone1)"
			@load-file="loadFile"
		/>
		<CategoryListEvent
			title="Form"
			file="tildes-gaming-2025-nov-form.json"
			:icon="IconPuzzle"
			color="var(--tone2)"
			@load-file="loadFile"
		/>
		<CategoryListEvent
			title="Free"
			file="tildes-gaming-alphabet.json"
			:icon="IconAbcBlocks"
			color="var(--tone3)"
			@load-file="loadFile"
		/>
	</ul>

	<CategoryListPreview
		v-if="jsonData"
		:json-data="jsonData"
		:json-type="jsonType"
		@clear-data="() => { jsonData = null; jsonType = ''; }"
	/>

	<nav
		v-if="jsonData"
		class="nav-bar"
	>
		<button @click="submitConfirm">{{ confirmButtonLabel }}</button>
	</nav>
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
