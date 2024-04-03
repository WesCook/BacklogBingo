<script setup>
	import { ref } from 'vue';
	import { downloadJSON } from '../utils/json-utils.js';

	const emit = defineEmits(['load-file', 'lock-download']);

	const urlInput = ref('');

	async function processDownload() {
		const url = urlInput.value;
		emit('lock-download', true);

		// Empty check
		if (!url) {
			console.log('No URL provided.');
			emit('lock-download', false);
			return false;
		}

		// Validate if provided string can be constructed into URL object
		try {
			new URL(url);
		} catch (err) {
			alert('The URL does not appear to be valid.');
			console.error(err);
			emit('lock-download', false);
			return false;
		}

		// Otherwise, proceed
		const json = await downloadJSON(urlInput.value);
		if (json) {
			emit('load-file', json);
		}
		emit('lock-download', false);
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
	.btn {
		min-width: 100px;
	}
	.btn:disabled {
		color: grey;
	}
</style>
