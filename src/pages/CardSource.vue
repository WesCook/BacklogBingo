<script setup>
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useErrors } from '../composables/errors.js';

	import { useCategories } from '../composables/categories.js';
	import { validateJSON } from '../utils/json-parse.js';

	import CardSourceEvent from '../components/CardSourceEvent.vue';
	import CardSourceFile from '../components/CardSourceFile.vue';
	import CardSourceURL from '../components/CardSourceURL.vue';
	import ModalWindow from '../components/ModalWindow.vue';

	const router = useRouter();
	const { getCardSource, setCardSource, isCardSourceSet } = useCategories();
	const { clearError } = useErrors();

	// Locking fieldset to disable all buttons when network request is active
	// Set true to lock, false to unlock
	const fieldset = ref(); // Template ref
	function lockDownload(locking) {
		fieldset.value.disabled = locking;
	}

	const loadedJSON = ref();
	
	// If we're returning, load the stored card source
	if (isCardSourceSet.value) {
		loadedJSON.value = getCardSource();
	}

	function loadFile(json) {
		if (validateJSON(json)) {
			clearError();
			loadedJSON.value = json;
		}
	}

	function confirmSource() {
		clearError();
		setCardSource(loadedJSON.value);
		router.push('/gamerules');
	}

	const previewActive = ref();
	function preview() {
		previewActive.value = true;
	}
</script>

<template>
	<h1>Choose Bingo Card Source</h1>
	<p>
		Select a bingo card from an event, or provide your own via JSON.
		<em>
			<a
				href="https://github.com/WesCook/BacklogBingo/blob/main/public/event-cards/tildes-gaming-nov-2023.json"
				target="_blank"
			>Example Format</a>
		</em>
	</p>

	<fieldset
		ref="fieldset"
		class="card-wrapper"
	>
		<div class="card-event">
			<h3>Prebuilt Event Cards</h3>
			<p>Bingo card sources from various online events.</p>
			<ul class="list">
				<CardSourceEvent
					title="Tildes Gaming Backlog Nov 2023"
					file="tildes-gaming-nov-2023.json"
					:selected-name="loadedJSON?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
				<CardSourceEvent
					title="Tildes Gaming Backlog May 2024"
					file="tildes-gaming-may-2024.json"
					:selected-name="loadedJSON?.name"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
			</ul>
		</div>

		<div class="card-url">
			<h3>From URL</h3>
			<p>You may download from a URL online.</p>
			<CardSourceURL
				@load-file="loadFile"
				@lock-download="lockDownload"
			/>
		</div>

		<div class="card-file">
			<h3>From File</h3>
			<p>Or select a file from your PC.</p>
			<CardSourceFile
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
		<p>When you're ready, click <em>Confirm Source</em> to move to the next step and configure your game rules.</p>
		<div class="btn-bar">
			<button @click="preview">Preview Categories</button>
			<button @click="confirmSource">Confirm Source</button>
		</div>
	</section>

	<teleport to="body">
		<ModalWindow
			v-if="previewActive"
			:title="loadedJSON.name"
			@close="previewActive = false"
		>
			<ol class="preview-list">
				<li
					v-for="category in loadedJSON.categories"
					:key="category"
				>
					{{ category.name }}
				</li>
			</ol>
		</ModalWindow>
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

		li {
			margin-bottom: 3px;
		}
	}
</style>
