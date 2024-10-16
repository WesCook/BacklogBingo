<script setup>
	import { ref, watch } from 'vue';

	import { useBingo } from '../composables/bingo.js';

	const { getBingoCard } = useBingo();

	const bingoCard = getBingoCard();

	const plaintext = ref();

	// Update plaintext initially and on change
	plaintext.value = generatePlaintext(bingoCard.categories);

	watch(bingoCard.categories, categories => {
		plaintext.value = generatePlaintext(categories);
	});

	function generatePlaintext(categories) {
		const complete = [];
		const incomplete = [];

		categories.forEach(category => {
			if (category.entry) {
				complete.push(`${category.cat}: ${category.entry}`);
			} else {
				incomplete.push(category.cat);
			}
		});

		const list = [];
		if (complete.length > 0) {
			list.push('Complete:');
			list.push(...complete);
			list.push('');
		}
		if (incomplete.length > 0) {
			list.push('Incomplete:');
			list.push(...incomplete);
			list.push('');
		}

		return list.join('\n');
	}
</script>

<template>
	<div>
		<div class="header">
			<span>Plain Text</span>
		</div>
		<textarea
			:value="plaintext"
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
</style>
