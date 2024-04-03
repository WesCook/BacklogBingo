<script setup>
	import { ref } from 'vue';

	const emit = defineEmits(['load-file']);

	const urlInput = ref('');
	const attemptingConnection = ref(false); // Disable button when Fetch is clicked

	async function processDownload() {
		attemptingConnection.value = true;
		const url = urlInput.value;

		// Empty check
		if (!url) {
			console.log('No URL provided.');
			attemptingConnection.value = false;
			return;
		}

		// See if string can be constructed into URL object
		try {
			new URL(url);
		} catch (err) {
			alert('The URL does not appear to be valid.');
			console.error(err);
			attemptingConnection.value = false;
			return;
		}

		// Attempt to download from URL
		try {
			const res = await fetch(url);
			if (!res.ok) {
				console.log('A network error occured.');
				console.error(res);
				alert('There was an error downloading from the URL.');
				attemptingConnection.value = false;
				return;
			}

			const json = await res.json();
			emit('load-file', json);
		} catch (err) {
			if (err.name === 'SyntaxError') {
				console.log(`Failed to parse ${url} as JSON`);
				console.error(err.message);
				alert('A file was downloaded, but it could not be read.  Is it a valid JSON file?');
			} else if (err.name === 'TypeError') {
				console.error(err.message);
				alert('There was an error downloading from the URL, as an unexpected response was received.');
			}
			else {
				console.error(err.name, err.message);
				alert('An unknown error occurred.');
			}
		}

		attemptingConnection.value = false;
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
		<button :disabled="attemptingConnection">Fetch URL</button>
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
</style>
