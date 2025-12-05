<script setup>
	import { ref } from 'vue';
	import { useErrors } from '../composables/errors.js';
	import { downloadJSON } from '../utils/json-parse.js';

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

		// Otherwise, proceed
		const json = await downloadJSON(urlInput.value);
		if (json) {
			emit('load-file', json);
		}
	}
</script>

<template>
	<form
		class="form"
		@submit.prevent="processDownload"
	>
		<input
			v-model="urlInput"
			class="url-input"
			type="text"
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
