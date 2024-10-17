<script setup>
	import { ref, watch } from 'vue';

	import { useCardOutput } from '../composables/card-output.js';

	import CopyToClipboard from '../components/CopyToClipboard.vue';

	const { getBingoCardOutput } = useCardOutput();

	// Populate output with initial data and watch for changes
	const output = ref();
	output.value = generateOutput(getBingoCardOutput());

	watch(getBingoCardOutput, categories => {
		output.value = generateOutput(categories);
	});

	function generateOutput(categories) {
		const complete = categories
			.filter(cat => cat.starType !== 'free' && cat.isSatisfied) // Filter out free star tile from checklist
			.map(cat => `${cat.category}: ${cat.entry}`); // List everything else from completed categories

		const incomplete = categories
			.filter(cat => !cat.isSatisfied)
			.map(cat => cat.category);

		return [
			...complete.length > 0 ? ['Complete:', ...complete, ''] : [],
			...incomplete.length > 0 ? ['Incomplete:', ...incomplete, ''] : [],
		].join('\n');
	}
</script>

<template>
	<div>
		<div class="header">
			<span>A plain text list, separated by completion state.</span>

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
