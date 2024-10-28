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
		setTimeout(() => document.getElementById('confirm')?.scrollIntoView({ behavior: 'smooth' }), 0); // Delayed to allow element to be created
	}

	function confirmList() {
		clearError();
		setCategoryList(loadedJSON.value);
		router.push('/gamerules');
	}
</script>

<template>
	<nav class="nav-bar">
		<h1>Backlog Bingo</h1>
	</nav>

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
			<h4>Actively-running events</h4>
			<ul class="list">
				<CategoryListEvent
					title="Backlog Burner: Nov 2024 Flow"
					file="tildes-gaming-nov-2024-flow.json"
					:selected-name="loadedJSON?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
				<CategoryListEvent
					title="Backlog Burner: Nov 2024 Flux"
					file="tildes-gaming-nov-2024-flux.json"
					:selected-name="loadedJSON?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
			</ul>
			<h4>Older events</h4>
			<ul class="list">
				<CategoryListEvent
					title="Backlog Burner: May 2024"
					file="tildes-gaming-may-2024.json"
					:selected-name="loadedJSON?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
				<CategoryListEvent
					title="Backlog Burner: Nov 2023"
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
		id="confirm"
		class="confirmation-panel"
	>
		<h2>Selected List</h2>
		<div class="details-box">
			<button
				class="close-button"
				@click="loadedJSON = null;"
			>
				✖
			</button>
			<h3>{{ loadedJSON.name }}</h3>
			<span>Total Categories: {{ loadedJSON.categories.length }}</span>
			<button
				class="preview-button"
				@click="modalActive = true;"
			>
				Preview
			</button>
			<blockquote v-if="loadedJSON.description">
				{{ loadedJSON.description }}
			</blockquote>
		</div>
		<p>When you're ready, click <em>Confirm List</em> to move to the next step and configure your game rules.</p>
		<nav class="btn-bar">
			<button @click="confirmList">Confirm List</button>
		</nav>
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
