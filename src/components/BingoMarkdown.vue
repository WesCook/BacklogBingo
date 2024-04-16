<script setup>
	import { ref, watch } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	const { getGameRules, calculateGameMode } = useGameRules();
	const { getRowLength, shouldShrinkGrid } = useCategories();
	const { getBingoCard } = useBingo();

	const bingoCard = getBingoCard();
	const gamemode = calculateGameMode(shouldShrinkGrid());
	const gridSize = getGameRules().gridSize;
	const rowLength = getRowLength(gridSize);

	const markdown = ref();
	const status = ref(); // Template ref

	// Update markdown initially and on change
	markdown.value = generateMarkdown(bingoCard.categories, rowLength);
	watch(bingoCard.categories, catArr => {
		markdown.value = generateMarkdown(catArr, rowLength);
	});


	function generateMarkdown(categories, rowLength) {
		let table = '';
		let index = 0;

		// Generate table header
		let header = '|';
		for (let i = 0; i < rowLength; i++) {
			if (i === Math.floor(rowLength / 2)) {
				header += (bingoCard.win) ? ' Winning Bingo! |' : ' Bingo |';
			} else {
				header += ' |';
			}
		}
		table += header + '\n';

		// Table alignment
		header = '|';
		for (let i = 0; i < rowLength; i++) {
			header += ':-:|';
		}
		table += header + '\n';

		// Generate table rows
		while (index < categories.length) {
			const row = categories.slice(index, index + rowLength);
			// const rowCells = row.map(item => `| ${item.game ? `~~${item.cat}~~` : item.cat}${item.game ? `<br>**✔ ${item.game}**` : ''} `).join('') + '|'; // One-liner.  Split up for readability.
			const rowCells = row.map(item => {
				let cellContent = '';
				if (item.game) {
					cellContent += `~~${item.cat}~~`;
				} else {
					cellContent += item.cat;
				}
				if (item.game) {
					cellContent += `<br>**✔ ${item.game}**`;
				}
				return `| ${cellContent} `;
			}).join('') + '|';

			table += rowCells + '\n';
			index += rowLength;
		}

		return table;
	}

	function copy() {
		// Play Copied! animation and pause at end of animation
		status.value.style.animationPlayState = 'running';
		status.value.addEventListener('animationiteration', () => {
			status.value.style.animationPlayState = 'paused';
		});

		// Copy to clipboard
		navigator.clipboard.writeText(markdown.value);
	}
</script>

<template>
	<textarea
		:value="markdown"
		class="textarea"
	>&nbsp;</textarea>
	<button
		class="copy-btn"
		@click="copy"
	>
		📋&#xFE0E; &nbsp;Copy Table
	</button>
	<span
		ref="status"
		class="status"
	>Copied!</span>
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
		margin: 25px 0 10px 0;
		padding: 10px;
		font-family: monospace;
		font-size: 0.9em;
		transition: none;
	}
	.copy-btn {
		all: unset;
		padding: 5px;
		font-variant-emoji: normal;
	}

	.status {
		margin-left: 10px;
		animation-name: fadeOut;
		animation-duration: 3.5s;
		animation-timing-function: linear;
		animation-iteration-count: infinite; /* We catch it with an event instead */
		animation-play-state: paused;
		visibility: hidden;
		opacity: 0;
	}
	@keyframes fadeOut {
		0% {
			visibility: hidden;
			opacity: 0;
		}
		15% {
			visibility: visible;
			opacity: 1;
		}
		70% {
			visibility: visible;
			opacity: 1;
		}
		100% {
			visibility: hidden;
			opacity: 0;
		}
	}
</style>
