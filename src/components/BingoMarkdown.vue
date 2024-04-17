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
	watch(bingoCard.categories, categories => {
		markdown.value = generateMarkdown(categories, rowLength);
	});


	function generateMarkdown(categories, rowLength) {
		let table = '';
		let index = 0;
		const centerCol = Math.floor(rowLength / 2);

		// Generate table header
		let header = '|';
		for (let i = 0; i < rowLength; i++) {
			if (i === centerCol - 1) {
				header += ` Mode: ${capitalizeFirstLetter(gamemode)} |`;
			} else if (i === centerCol) {
				header += (bingoCard.win) ? ' Winning Bingo! |' : ' Bingo! |';
			} else if (i === centerCol + 1) {
				header += ` Finished ${bingoCard.categories.filter(obj => obj.entry).length}/${bingoCard.categories.length} |`;
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
			const rowCells = row.map(item => {
				let cellContent = '';
				if (item.entry) {
					cellContent += `~~${item.cat}~~`;
				} else {
					cellContent += item.cat;
				}
				if (item.entry) {
					cellContent += `<br>**✔ ${item.entry}**`;
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

	function capitalizeFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<template>
	<textarea
		:value="markdown"
		class="textarea"
		readonly
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
		padding: 10px;
		font-family: monospace;
		font-size: 0.9em;
		transition: none;
		margin-bottom: 10px;
	}
	.copy-btn {
		all: unset;
		padding: 5px;
		font-variant-emoji: text;
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
