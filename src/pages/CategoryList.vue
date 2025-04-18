<script setup>
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useErrors } from '../composables/errors.js';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';
	import { validateJSON, detectDynamicCategory, parseDynamicCategory } from '../utils/json-parse.js';

	import CategoryListEvent from '../components/CategoryListEvent.vue';
	import CategoryListFile from '../components/CategoryListFile.vue';
	import CategoryListURL from '../components/CategoryListURL.vue';
	import DynamicCategory from '../components/DynamicCategory.vue';
	import UIModal from '../components/UIModal.vue';

	const router = useRouter();
	const { clearGameRules, setGameRule, resetGameRules } = useGameRules();
	const { getCategoryList, setCategoryList, isCategoryListSet, shouldShrinkGrid } = useCategories();
	const { setBingoCard } = useBingo();
	const { clearError, setError } = useErrors();

	// Locking fieldset to disable all buttons when network request is active
	// Set true to lock, false to unlock
	const fieldset = ref(); // Template ref
	function lockDownload(locking) {
		fieldset.value.disabled = locking;
	}

	const jsonData = ref();
	const jsonType = ref();
	const modalActive = ref();

	// If we're returning from another page, load the stored category list and clear any set game rules
	if (isCategoryListSet.value) {
		jsonData.value = getCategoryList();
		clearGameRules();
	}

	// Loading categories list or imported card
	function loadFile(json) {
		// First, figure out the type
		if (Object.hasOwn(json, 'exported')) { // Has key "exported", must be Bingo Import
			jsonType.value = 'bingo-import';
		} else {
			jsonType.value = 'category-list';
		}

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

		// Update data and scroll down (small delay to allow element to be created)
		jsonData.value = json;
		setTimeout(() => document.getElementById('confirm')?.scrollIntoView({ behavior: 'smooth' }), 0);
	}

	// Commit action after loading JSON
	function confirmList() {
		clearError();

		if (jsonType.value === 'category-list') {
			// Update categories and move to next page (game rules)
			setCategoryList(jsonData.value);
			router.push('/gamerules');
		} else if (jsonType.value === 'bingo-import') {
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
	}
</script>

<template>
	<nav class="nav-bar">
		<h1>Backlog Bingo</h1>
	</nav>

	<p>
		Welcome to Backlog Bingo!  This web app lets you generate a bingo card, either from a prebuilt category list or from your own <a
			href="https://github.com/WesCook/BacklogBingo/wiki/Category-List"
			target="_blank"
		>provided JSON</a>.
	</p>

	<fieldset
		ref="fieldset"
		class="card-wrapper"
	>
		<div class="card-event">
			<h3>Prebuilt Category Lists</h3>
			<p>Participate in an ongoing event!</p>
			<ul class="list">
				<CategoryListEvent
					title="Backlog Burner: Nov 2024 Flow"
					file="tildes-gaming-2024-nov-flow.json"
					:selected-name="jsonData?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
				<CategoryListEvent
					title="Backlog Burner: Nov 2024 Flux"
					file="tildes-gaming-2024-nov-flux.json"
					:selected-name="jsonData?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
				<CategoryListEvent
					title="Backlog Burner: Free"
					file="tildes-gaming-alphabet.json"
					:selected-name="jsonData?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
			</ul>
		</div>

		<div class="card-url">
			<h3>From URL</h3>
			<p>You may download from a URL online.</p>
			<CategoryListURL
				@load-file="loadFile"
				@lock-download="lockDownload"
			/>
		</div>

		<div class="card-file">
			<h3>From File</h3>
			<p>Or select a file from your PC.</p>
			<CategoryListFile
				@load-file="loadFile"
				@lock-download="lockDownload"
			/>
		</div>
	</fieldset>

	<section
		v-if="jsonData"
		id="confirm"
		class="confirmation-panel"
	>
		<h2>{{ jsonType === 'bingo-import' ? 'Imported Bingo Card' : 'Selected List' }}</h2>
		<div class="details-box">
			<button
				class="close-button"
				@click="jsonData = null; jsonType = ''; modalActive = false;"
			>
				✖
			</button>
			<h3>{{ jsonData.name }}</h3>
			<p v-if="jsonType === 'bingo-import'">
				Export Date: {{ new Date(jsonData.exported).toLocaleDateString() }}
			</p>
			<span v-if="jsonType === 'category-list'">Total Categories: {{ jsonData.categories.length }}</span>
			<span v-else>
				Imported Categories
				({{ jsonData.categories.filter(category => category.entry).length }}/{{ jsonData.gamerules?.star === 'free' ? jsonData.categories.length - 1 : jsonData.categories.length }} complete)
			</span>
			<button
				class="preview-button"
				@click="modalActive = true;"
			>
				Preview
			</button>
			<blockquote v-if="jsonData.description">
				{{ jsonData.description }}
			</blockquote>
		</div>
		<p v-if="jsonType === 'category-list'">
			When you're ready, click <em>Confirm List</em> to move to the next step and configure your game rules.
		</p>
		<nav class="btn-bar">
			<button @click="confirmList">{{ jsonType === 'bingo-import' ? 'Import Card' : 'Confirm List' }}</button>
		</nav>
	</section>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			:title="jsonData.name"
			:show-close="true"
			@close="modalActive = false"
		>
			<ol class="preview-list">
				<li
					v-for="category in jsonData.categories"
					:key="category"
				>
					<span v-if="jsonType === 'bingo-import'">
						{{ category.entry ? `✅ ${category.cat} (${category.entry})` : category.cat }}
					</span>
					<template v-else>
						<DynamicCategory
							v-if="category.dynamic"
							:name="category.name"
						/>
						<span v-else>{{ category.name }}</span>
					</template>
				</li>
			</ol>
		</UIModal>
	</teleport>
</template>

<style scoped>
	/* Layout */
	.card-wrapper {
		display: grid;
		grid-template-columns: 2fr 1.5fr;
		grid-template-areas:
			"card-event card-url"
			"card-event card-file";
		gap: 1em;
		margin-top: 1.2em;
		padding: 0;

		& > div {
			padding: 25px;
		}
	}

	.confirmation-panel {
		margin-top: 2em;

		h2 {
			text-align: center;
			margin-bottom: 10px;
		}
	}

	.btn-bar {
		display: flex;
		justify-content: end;
		margin-top: 2em;
	}

	/* Category List Headers */
	h4 {
		font-weight: normal;
	}
	.list + h4 {
		margin-top: 1.6em;
	}

	/* Remove styling for semantic elements */
	.list {
		list-style: none;
		padding-left: 0;
	}
	.card-wrapper {
		border: none;
		transition: opacity 0.2s ease;
	}
	/* Indicate when buttons are inactive */
	.card-wrapper[disabled] {
		opacity: 70%;
	}

	/* Column view on mobile */
	@media (max-width: 750px) {
		.card-wrapper {
			grid-template-columns: 1fr;
			grid-template-areas:
				"card-event"
				"card-url"
				"card-file";
		}
	}

	/* Individual options */
	.card-event {
		grid-area: card-event;
		background-color: var(--tone1);
	}
	.card-url {
		grid-area: card-url;
		background-color: var(--tone2);
	}
	.card-file {
		grid-area: card-file;
		background-color: var(--tone3);
	}

	/* Details box */
	.details-box {
		background-color: var(--background-shaded);
		padding: 1em;

		h3 {
			margin-top: 0;
			margin-bottom: 6px;
		}

		.preview-button {
			margin-left: 0.5em;
			padding: 4px;
		}

		.close-button {
			float: right;
			margin-left: 0.4em;
			margin-bottom: 0.4em;
		}

		blockquote {
			font-style: italic;
			margin-top: 0.8em;

			&::before {
				content: "“";
			}
			&::after {
				content: "”";
			}
		}
	}

	/* Categories listed in modal preview */
	.preview-list {
		list-style: decimal;
		padding-left: 50px;
		margin: 2px;

		li {
			margin-bottom: 4px;
		}
	}
</style>
