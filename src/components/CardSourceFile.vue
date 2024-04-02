<script setup>
	const emit = defineEmits(['load-file']);

	// Parses file contents into string
	function processFile(event) {

		const file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			// Verify file is not empty
			if (!reader.result) {
				alert('There was an error parsing the file.  It appears to be empty.');
				console.error('JSON file is empty');
				return;
			}

			// Verify file is readable as JSON, and forward to next validator to hopefully be loaded
			try {
				const json = JSON.parse(reader.result);
				emit('load-file', json);
			} catch (err) {
				alert('There was an error parsing the file.  Is it a valid JSON file?');
				console.error(err);
				return;
			}
		};
	}
</script>

<template>
	<input
		class="file-picker"
		type="file"
		accept=".json"
		@change="processFile"
	>
</template>

<style scoped>
	.file-picker {
		width: 100%;
		padding: 5px;
	}
</style>
