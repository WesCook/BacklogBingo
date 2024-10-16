<script setup>
	import { ref, watch } from 'vue';

	import { useBingo } from '../composables/bingo.js';

	import CopyToClipboard from '../components/CopyToClipboard.vue';

	const { getBingoCard } = useBingo();

	const bingoCard = getBingoCard();

	const output = ref();

	output.value = generateOutput(bingoCard.categories);

	watch(bingoCard.categories, categories => {
		output.value = generateOutput(categories);
	});

	function generateOutput(categories) {
		return [
			'| | **Category** | **Entry** |',
			':-|:-|:-|',
			...categories.map(
				({ cat, entry }) => `| ${entry ? '✅' : '⬜'} | ${cat} | ${entry || ''} |`
			),
			''
		].join('\n');
	}
</script>

<template>
	<div>
		<div class="header">
			<span>A checklist in Markdown, well-suited for sharing blackout cards.</span>
			<CopyToClipboard
				:text="output"
				alignment="right"
			/>
		</div>
		<textarea
			:value="output"
			class="textarea"
			readonly
		></textarea>
	</div>
</template>

<style scoped>
	.textarea {
		display: block;
		width: 100%;
		min-width: 100%;
		max-width: 100%;
		height: 140px;
		min-height: 100px;
		max-height: 600px;
		padding: 10px;
		font-family: monospace;
		font-size: 0.9em;
		transition: none;
		margin-bottom: 10px;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 5px;
		margin-bottom: 0.6em;
	}
	.header div:last-child {
		margin-left: auto;
	}
</style>
