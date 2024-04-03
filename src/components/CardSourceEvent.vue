<script setup>
	import { downloadJSON } from '../utils/json-utils.js';

	// eslint-disable-next-line no-unused-vars
	const props = defineProps({
		title: {
			type: String,
			default: 'No Title'
		},
		file: {
			type: String,
			default: ''
		}
	});
	const emit = defineEmits(['load-file', 'lock-download']);

	async function processEvent(filename) {
		emit('lock-download', true);
		const path = `./category-json/${filename}`;
		const json = await downloadJSON(path);
		if (json) {
			emit('load-file', json);
		}
		emit('lock-download', false);
	}
</script>

<template>
	<li>
		<button @click="processEvent(file)">Select</button> <span>{{ title }}</span>
	</li>
</template>

<style scoped>
	li {
		margin-bottom: 0.5em;
	}
</style>
