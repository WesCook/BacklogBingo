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
