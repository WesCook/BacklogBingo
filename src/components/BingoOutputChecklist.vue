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
		return [
			'| | **Category** | **Entry** |',
			':-|:-|:-|',
			...categories
				.filter(cat => cat.starType !== 'free') // Filter out free star tile from checklist
				.map(cat => `| ${(cat.isSatisfied) ? '✅' : '⬜'} | ${cat.category} | ${cat.entry} |`) // List everything else with optional checkmark
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
				style="margin-left: auto;"
			/>
		</div>

		<textarea
			:value="output"
			class="textarea"
			readonly
		></textarea>
	</div>
</template>
