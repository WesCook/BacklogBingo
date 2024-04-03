<script setup>
	import { ref } from 'vue';

	import CardSourceEvent from '../components/CardSourceEvent.vue';
	import CardSourceFile from '../components/CardSourceFile.vue';
	import CardSourceURL from '../components/CardSourceURL.vue';

	import { validateJSON } from '../utils/json-utils.js';

	const loadedJSON = ref();

	function loadFile(json) {
		if (validateJSON(json)) {
			console.log(json);
			loadedJSON.value = json;
			// TODO: Place into store
		}
	}

	// Locking fieldset to disable all buttons when network request is active
	// Set true to lock, false to unlock
	const fieldset = ref();
	function lockDownload(locking) {
		fieldset.value.disabled = locking;
	}
</script>

<template>
	<h1>Choose Bingo Card Source</h1>
	<p>
		Select a bingo card from an event, or provide your own via JSON.
		<em>
			<a
				href="https://github.com/WesCook/BacklogBingo/blob/main/public/category-json/tildes-gaming-nov-2023.json"
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
			<p>Prebuilt bingo card sources from different online events.</p>
			<ul class="list">
				<CardSourceEvent
					title="Tildes Gaming Backlog Nov 2023"
					file="tildes-gaming-nov-2023.json"
					@load-file="loadFile"
					@lock-download="lockDownload"
				/>
				<CardSourceEvent
					title="Tildes Gaming Backlog May 2024"
					file="tildes-gaming-may-2024.json"
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

	<!-- <p>Once the card has been loaded, you may edit your game rules.</p> -->
	<!-- <RouterLink to="gamerules">
		<button>Edit Game Rules</button>
	</RouterLink> -->

	<div>
		<h2 style="margin-top: 50px;">
			Debug Data
		</h2>
		{{ loadedJSON }}
	</div>
</template>

<style scoped>
	/* Layout */
	.card-wrapper {
		display: grid;
		grid-template-areas:
			"card-event card-url"
			"card-event card-file";
		gap: 1em;
		& > div {
			padding: 25px;
		}
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
</style>
