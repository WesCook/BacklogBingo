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
	<li
		class="li"
		:class="{ highlight: selectedName === title }"
	>
		<button @click="processEvent(file)">Select</button>
		<span>{{ title }}</span>
	</li>
</template>

<style scoped>
	.li {
		margin-bottom: 0.5em;
	}
	.li span {
		margin-left: 0.4em;
	}
	.highlight button {
		border: 1px solid grey;
	}
	.highlight span {
		font-style: italic;
		color: color-mix(in srgb, var(--foreground-color) 85%, var(--background-color));
	}
</style>
