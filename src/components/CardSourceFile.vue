<script setup>
	const emit = defineEmits(['load-file']);

	// Parses file contents into string
	function processFile(event) {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			emit('load-file', reader.result);
		};
	}
</script>

<template>
	<input
		class="filePicker"
		type="file"
		accept=".json"
		@change="processFile"
	>
</template>

<style scoped>
	.filePicker {
		width: 100%;
	}
</style>
