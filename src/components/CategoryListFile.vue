<script setup>
	import { useErrors } from '../composables/errors.js';

	const { setError } = useErrors();

	const emit = defineEmits(['load-file']);

	// Parses file contents into string
	function processFile(event) {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			// Verify file is readable and not empty
			if (!reader.result) {
				setError('There was an error reading the file.');
				return;
			}

			// Verify file is readable as JSON, and forward to next validator to hopefully be loaded
			try {
				const json = JSON.parse(reader.result);
				emit('load-file', json);
			} catch (err) {
				setError(`There was an error parsing the file.  Is it a valid JSON file?\n\n${err}`);
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
		height: 42px;
		padding-left: 8px;
		line-height: 2.6; /* Required to vertically center? */
		color: grey;
	}

	.file-picker::file-selector-button {
		height: 100%;
		float: right;
		margin-right: 0;
		border: none;
		border-left: 1px solid var(--border-color);
	}

	input[type="file"]:not(:disabled):hover::file-selector-button {
		cursor: pointer;
		background-color: color-mix(in srgb, var(--background-shaded) 88%, var(--foreground-color));
	}

	input[type="file"]:active::file-selector-button {
		background-color: color-mix(in srgb, var(--background-shaded) 80%, var(--foreground-color));
	}
</style>
