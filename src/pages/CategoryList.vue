<script setup>
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useErrors } from '../composables/errors.js';

	import { useCategories } from '../composables/categories.js';
	import { validateJSON, detectDynamicCategory, parseDynamicCategory } from '../utils/json-parse.js';

	import CategoryListEvent from '../components/CategoryListEvent.vue';
	import CategoryListFile from '../components/CategoryListFile.vue';
	import CategoryListURL from '../components/CategoryListURL.vue';
	import DynamicCategory from '../components/DynamicCategory.vue';
	import UIModal from '../components/UIModal.vue';

	const router = useRouter();
	const { getCategoryList, setCategoryList, isCategoryListSet } = useCategories();
	const { clearError, getError } = useErrors();

	// Locking fieldset to disable all buttons when network request is active
	// Set true to lock, false to unlock
	const fieldset = ref(); // Template ref
	function lockDownload(locking) {
		fieldset.value.disabled = locking;
	}

	const loadedJSON = ref();
	const modalActive = ref();

	// If we're returning from another page, load the stored category list
	if (isCategoryListSet.value) {
		loadedJSON.value = getCategoryList();
	}

	function loadFile(json) {
		if (!validateJSON(json)) {
			return;
		}
		clearError();

		// Detect and parse dynamic categories to report any errors early
		for (const cat of json.categories) {
			if (detectDynamicCategory(cat.name)) {
				cat.dynamic = true;
				parseDynamicCategory(cat.name); // Throws error if invalid, so bail out
				if (getError().value) {
					return;
				}
			}
		}

		loadedJSON.value = json;
	}

	function confirmList() {
		clearError();
		setCategoryList(loadedJSON.value);
		router.push('/gamerules');
	}
</script>

<template>
	<h1>Backlog Bingo</h1>
	<p>
		Welcome to Backlog Bingo!  This web app lets you generate a bingo card, either from a prebuilt category list or from your own provided JSON.
		<em>
			<a
				href="https://github.com/WesCook/BacklogBingo/blob/main/public/event-lists/tildes-gaming-may-2024.json"
				target="_blank"
			>Example Format</a>
		</em>
	</p>

	<fieldset
		ref="fieldset"
		class="card-wrapper"
	>
		<div class="card-event">
			<h3>Prebuilt Category Lists</h3>
			<p>Bingo category lists from online events.</p>
			<ul class="list">
				<CategoryListEvent
					title="Tildes Backlog Burner - May 2024"
					file="tildes-gaming-may-2024.json"
					:selected-name="loadedJSON?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
				<CategoryListEvent
					title="Tildes Backlog Burner - Nov 2023"
					file="tildes-gaming-nov-2023.json"
					:selected-name="loadedJSON?.name"
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
		v-if="loadedJSON"
		class="confirmation-panel"
	>
		<p>Awesome!  You've selected <strong>{{ loadedJSON.name }}</strong>.  It has {{ loadedJSON.categories.length }} categories available.</p>
		<p>When you're ready, click <em>Confirm List</em> to move to the next step and configure your game rules.</p>
		<div class="btn-bar">
			<button @click="modalActive = true;">Preview Categories</button>
			<button @click="confirmList">Confirm List</button>
		</div>
	</section>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			:title="loadedJSON.name"
			:show-close="true"
			@close="modalActive = false"
		>
			<ol class="preview-list">
				<li
					v-for="category in loadedJSON.categories"
					:key="category"
				>
					<DynamicCategory
						v-if="category.dynamic"
						:name="category.name"
					/>
					<span v-else>{{ category.name }}</span>
				</li>
			</ol>
		</UIModal>
	</teleport>
</template>

<style scoped>
	/* Layout */
	.card-wrapper {
		display: grid;
		grid-template-columns: 2fr 1.4fr;
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
	}

	.btn-bar {
		display: flex;
		justify-content: space-between;
		margin-top: 2em;
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
