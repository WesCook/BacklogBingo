<script setup>
	import { ref, watch, computed } from 'vue';
	import { useRouter } from 'vue-router';

	import { useErrors } from '../composables/errors.js';
	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import UIModal from '../components/UIModal.vue';
	import DynamicCategory from '../components/DynamicCategory.vue';
	import CategoryListFile from '../components/CategoryListFile.vue';
	import CategoryListURL from '../components/CategoryListURL.vue';
	import ErrorPanel from '../components/ErrorPanel.vue';
	import IconUpload from '../components/icons/IconUpload.vue';
	import { validateJSON } from '../utils/json-parse.js';
	import { determineType, validateDynamicCategories, markDynamicCategories } from '../utils/file-import.js';

	const router = useRouter();
	const { clearGameRules, resetGameRules, setGameRule } = useGameRules();
	const { setCategoryList } = useCategories();
	const { setBingoCard } = useBingo();
	const { getError, clearError } = useErrors();

	const error = getError();
	const modalActive = ref();
	const loadedJson = ref();

	// Custom json is passed up via file or URL
	function loadFile(json) {
		loadedJson.value = null;

		// Determine if bingo card or custom category list
		const type = determineType(json);
		console.log('Found import of type', type);

		// Validate relevant schema
		if (!validateJSON(json, type)) return;

		// Validate any dynamic categories on custom category lists, and mark for later use
		if (type == 'category-list') {
			if (!validateDynamicCategories(json)) return;
			json = markDynamicCategories(json);
		}

		// Looks like the json is clean.  Ready to import.
		clearError();
		loadedJson.value = json;

		// Print nicely to console
		console.groupCollapsed(`Loaded ${json.categories.length} categories...`);
		categoryDisplay.value.forEach(cat => {
			console.log(cat.name);
		});
		console.groupEnd();
	}

	// Import button is clicked after json is loaded
	// Either update categories or bingo data, and redirect to appropriate page
	function confirmImport() {
		const type = determineType(loadedJson.value);
		if (type == 'category-list') {
			clearGameRules(); // Necessary as lists can change default rules, so swapping lists may create unexpected states
			setCategoryList(loadedJson.value);
			router.push('/settings');
		} else if (type == 'bingo-import') {
			// Construct new card and overwrite
			setBingoCard({
				name: loadedJson.value.name,
				categories: loadedJson.value.categories,
			});

			// Update gamerules - Start with standard, then apply overrides
			// This way, adding new game rules won't invalidate the schema
			resetGameRules('standard', false, false);
			Object.entries(loadedJson.value.gamerules).forEach(([rule, value]) => {
				setGameRule(rule, value);
			});

			// Jump straight to bingo card
			router.push('/bingo');
		}
	}

	// If any errors are detected, clear the loaded json
	// This comes up when, for example, an invalid JSON file is loaded after a successful one.
	// The user might clear the error, allowing the previous JSON to be used in a confusing way.
	// Each attempt at uploading a file should clear all state.
	watch(error, (newValue, _) => {
		if (newValue) { // If error string is present
			loadedJson.value = null;
		}
	});

	// If closing modal, clear the loaded json
	watch(modalActive, (newValue, _) => {
		if (!newValue) {
			loadedJson.value = null;
		}
	});

	// Performant way of generating a success message
	const successMessage = computed(() => {
		if (!loadedJson.value) {
			return '';
		}

		const json = loadedJson.value;
		const type = determineType(loadedJson.value);

		if (type == 'category-list') {
			return `Found list '${json.name}' with ${json.categories.length} categories – ready to import`;
		}

		if (type == 'bingo-import') {
			const completed = json.categories.filter(cat => cat.entry).length;
			return `Found card '${json.name}' with ${completed}/${json.categories.length} completed categories – ready to import`;
		}

		return '';
	});

	// Helper function to pass along category list with consistent names from either category list or bingo card import
	// This is only needed because the property varies between 'cat.cat' and 'cat.name'.
	// TODO: Reconsider this, and prefer using 'name' everywhere (card localStorage, export file, schemas).  This will invalidate existing cards/imports though.
	const categoryDisplay = computed(() => {
		const json = loadedJson.value;
		const list = json.categories;

		if (determineType(json) == 'bingo-import') {
			// Map cat.cat > cat.name
			return list.map(({ cat, ...rest }) => ({
				name: cat,
				...rest
			}));
		}

		// Type is 'category-list', so no alteration needed
		return list;
	});
</script>

<template>
	<button
		class="btn"
		title="Import bingo card or custom list"
		@click="modalActive = true"
	>
		<IconUpload /> Import
	</button>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			title="Import"
			class="modal"
			:show-close="false"
			@close="modalActive = false"
		>
			<IconUpload
				size="50px"
				class="modal-icon"
			/>

			<p>
				Import an existing card, or generate a new card from a custom list.
				<a
					href="https://github.com/WesCook/BacklogBingo/wiki/Category-List"
					target="_blank"
				>Learn more</a>.
			</p>

			<p>Select a file from your PC</p>
			<CategoryListFile @load-file="loadFile" />

			<p>Or download from an online URL</p>
			<CategoryListURL @load-file="loadFile" />

			<template v-if="!error && loadedJson">
				<p class="success-message">
					{{ successMessage }}
				</p>

				<!-- Import preview -->
				<details class="preview-details">
					<summary>Import Preview</summary>
					<ol>
						<li
							v-for="(category, index) in categoryDisplay"
							:key="index"
						>
							<DynamicCategory
								v-if="category.dynamic"
								:name="category.name"
							/>
							<span v-else>{{ category.name }}</span>
						</li>
					</ol>
				</details>
			</template>

			<ErrorPanel v-if="error" />

			<div class="buttons">
				<button @click="modalActive = false">Cancel</button>
				<button
					:disabled="error || !loadedJson"
					:class="{ 'button-success': !error && loadedJson }"
					@click="confirmImport"
				>
					Import
				</button>
			</div>
		</UIModal>
	</teleport>
</template>

<style scoped>
	.modal {
		padding: 0.2em 1.5em;

		.modal-icon {
			margin: 0 auto 2em auto;
		}

		.buttons {
			display: flex;
			justify-content: end;
			margin-right: 2px;
			gap: 1.5em;
			margin-top: 2em;
		}
	}

	.button-success {
		border: 1px solid color-mix(in srgb, #008000 60%, var(--background-shaded));
		box-shadow: 0 0 5px var(--foreground-color);
	}

	.success-message {
		margin-top: 2em;
		padding: 0.5em 0.8em;
		font-weight: bold;
		text-align: center;
		color: #008000;
		background: #eaffea;
		border: 1px solid #008000;
		border-radius: 6px;
	}

	.preview-details {
		margin-top: 1em;
		max-height: 200px;
		overflow-y: auto;
		background-color: color-mix(in srgb, var(--background-shaded) 98%, var(--foreground-color));

		summary {
			background-color: color-mix(in srgb, var(--background-shaded) 96%, var(--foreground-color));
			padding: 5px 5px 5px 11px;
		}
		summary:hover {
			cursor: pointer;
		}

		ol {
			list-style: decimal;
			margin-top: 10px;
		}
	}
</style>
