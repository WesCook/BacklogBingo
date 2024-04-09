<script setup>
	import { downloadJSON } from '../utils/json-parse.js';

	const props = defineProps({
		title: {
			type: String,
			default: 'No Title'
		},
		file: {
			type: String,
			default: ''
		},
		selectedName: {
			type: String,
			default: ''
		}
	});
	const emit = defineEmits(['load-file', 'lock-download']);

	async function processEvent(filename) {
		emit('lock-download', true);
		const path = `./event-cards/${filename}`;
		const json = await downloadJSON(path);
		if (json) {
			emit('load-file', json);
		}
		emit('lock-download', false);
	}
</script>

<template>
	<li class="li">
		<button @click="processEvent(file)">Select</button>
		<span :class="{highlight: selectedName === title}">{{ title }}</span>
	</li>
</template>

<style scoped>
	.li {
		margin-bottom: 0.5em;
	}
	.li span {
		margin-left: 0.4em;
	}
	.highlight {
		font-weight: bold;
	}
</style>
