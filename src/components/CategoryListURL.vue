<script setup>
	import { ref } from 'vue';
	import { useErrors } from '../composables/errors.js';

	const { setError } = useErrors();

	const emit = defineEmits(['load-file']);

	const urlInput = ref('');

	async function processDownload() {
		const url = urlInput.value;

		// Empty check
		if (!url) {
			setError('No URL provided.', false);
			return false;
		}

		// Validate if provided string can be constructed into URL object
		try {
			new URL(url);
		} catch {
			setError('The URL does not appear to be valid.');
			return false;
		}

		// Validate network conditions
		let file;
		try {
			// Unexpected network response code (eg. 404)
			const response = await fetch(url);
			if (!response.ok) {
				setError(`There was an error downloading from the URL.  The status code was ${response.status}.`);
				return;
			}

			file = await response.text();
		} catch (err) {
			// Fetch failed or the browser blocked access to the response (eg. offline or CORS)
			setError(`There was an error downloading from the URL.  Check the URL, connection, or server CORS settings.  The error message was ${err}.`);
			return;
		}

		emit('load-file', file);
	}
</script>

<template>
	<form
		class="form"
		@submit.prevent="processDownload"
	>
		<input
			id="json-url"
			v-model="urlInput"
			class="url-input"
			type="text"
			aria-label="JSON URL to download"
			placeholder="https://example.com/card.json"
		>
		<button class="btn">Fetch URL</button>
	</form>
</template>

<style scoped>
	.form {
		display: flex;
		height: 42px;
	}

	.url-input {
		flex: 1;
		padding: 8px;
	}
	.url-input::placeholder {
		font-size: 0.9em;
		color: grey;
	}

	.btn {
		min-width: 100px;
	}
	.btn:disabled {
		color: grey;
	}
</style>
