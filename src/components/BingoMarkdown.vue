<script setup>
	import { ref, watch, computed } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import BingoMarkdownInfo from '../components/BingoMarkdownInfo.vue';

	const props = defineProps({
		winState: {
			type: Boolean,
			default: false
		}
	});

	const { getGameRules, calculateGameMode } = useGameRules();
	const { getRowLength, shouldShrinkGrid } = useCategories();
	const { getBingoCard, getStarTile } = useBingo();

	const gamerules = getGameRules();
	const bingoCard = getBingoCard();
	const gamemode = calculateGameMode(shouldShrinkGrid());

	const markdown = ref();
	const status = ref(); // Template ref

	const gridSize = gamerules.gridSize;
	const rowLength = getRowLength(gridSize);

	// Update markdown initially and on change
	markdown.value = generateMarkdown(bingoCard.categories, rowLength);
	watch(bingoCard.categories, categories => {
		markdown.value = generateMarkdown(categories, rowLength);
	});
	watch(props, () => {
		markdown.value = generateMarkdown(bingoCard.categories, rowLength);
	});


	function generateMarkdown(categories, rowLength) {
		let table = '';
		let index = 0;
		const centerCol = Math.floor(rowLength / 2);
		const starUUID = getStarTile();

		// Get category numbers
		let currentCategories;
		let totalCategories;
		if (gamerules.star !== 'free') {
			currentCategories = bingoCard.categories.filter(cat => cat.entry).length;
			totalCategories = bingoCard.categories.length;
		} else {
			currentCategories = bingoCard.categories.filter(cat => cat.entry && cat.uuid !== starUUID).length;
			totalCategories = bingoCard.categories.length - 1;
		}

		// Generate table header
		let header = '|';
		for (let i = 0; i < rowLength; i++) {
			if (i === centerCol - 1) {
				header += ` Mode: ${capitalizeFirstLetter(gamemode)} |`;
			} else if (i === centerCol) {
				header += (props.winState) ? ' Winning Bingo! |' : ' Bingo! |';
			} else if (i === centerCol + 1) {
				header += ` Finished ${currentCategories}/${totalCategories} |`;
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
				let catName = item.cat;

				// Star tiles
				if (gamerules.star === 'free' && item.uuid === starUUID) { // Free
					return '| ★ ';
				}
				if (item.uuid === starUUID && gamerules.star === 'wildcard') { // Wildcard
					catName = 'Wildcard';
				}
				
				// Category
				if (item.entry) {
					cellContent += `~~${catName}~~`;
				} else {
					cellContent += catName;
				}

				// Entry
				if (item.entry || (item.entry && gamerules.star === 'wildcard' && item.uuid === starUUID)) {
					cellContent += ` <br> **✔ ${item.entry}**`;
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
	<div class="header">
		<span>Markdown Table</span>
		<BingoMarkdownInfo />
		<span
			ref="status"
			class="status"
		>Copied!</span>
		<button
			class="copy-btn"
			@click="copy"
		>
			📋&#xFE0E; &nbsp;Copy
		</button>
	</div>
	<textarea
		:value="markdown"
		class="textarea"
		readonly
	>&nbsp;</textarea>
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

		.status {
			margin-left: auto;
			margin-right: 12px;
		}
	}

	.copy-btn {
		all: unset;
		padding: 5px;
		font-variant-emoji: text;
		white-space: nowrap;
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
