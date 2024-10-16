<script setup>
	import { ref, watch } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import CopyToClipboard from '../components/CopyToClipboard.vue';

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

	const output = ref();
	const gridSize = gamerules.gridSize;
	const rowLength = getRowLength(gridSize);

	// Update markdown initially and on change
	output.value = generateOutput(bingoCard.categories, rowLength);

	watch(bingoCard.categories, categories => {
		output.value = generateOutput(categories, rowLength);
	});

	watch(props, () => {
		output.value = generateOutput(bingoCard.categories, rowLength);
	});

	function generateOutput(categories, rowLength) {
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
					catName = '★ Wildcard';
				}

				// Category
				if (item.entry) {
					cellContent += `~~${catName}~~`;
				} else {
					cellContent += catName;
				}

				// Entry
				if (item.entry || (item.entry && gamerules.star === 'wildcard' && item.uuid === starUUID)) {
					cellContent += ` <br> **✅ ${item.entry}**`;
				}
				return `| ${cellContent} `;
			}).join('') + '|';

			table += rowCells + '\n';
			index += rowLength;
		}

		return table;
	}

	function capitalizeFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<template>
	<div>
		<div class="header">
			<span>A table in Markdown, for easy sharing of your bingo card across various social media sites.</span>
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
