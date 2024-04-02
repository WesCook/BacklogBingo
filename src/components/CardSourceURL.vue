<script setup>
	import { ref } from 'vue';

	const emit = defineEmits(['load-file']);

	const urlInput = ref('');

	async function processDownload() {
		const url = urlInput.value;
		try {
			const res = await fetch(url);
			if (!res.ok) {
				console.log('A network error occured');
				console.error(res);
				alert('There was an error downloading from the URL');
				return;
			}

			const json = await res.json();
			emit('load-file', json);
		} catch (err) {
			if (err.name === 'SyntaxError') {
				console.log(`Failed to parse ${url} as JSON`);
				console.error(err.message);
				alert('The download succeeded, but the file could not be read.  Is it a valid JSON file?');
			}
			else {
				console.error(err.name, err.message);
				alert('An unknown error occurred');
			}
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
		<button>Fetch</button>
	</form>
</template>

<style scoped>
	.form {
		display: flex;
	}
	.url-input {
		flex: 1;
		padding: 8px;
	}
</style>
