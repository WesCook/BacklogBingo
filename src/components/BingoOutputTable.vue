<script setup>
	import { ref, watch } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useCardOutput } from '../composables/card-output.js';

	import CopyToClipboard from '../components/CopyToClipboard.vue';

	const props = defineProps({
		winState: {
			type: Boolean,
			default: false
		}
	});

	const { getGameRules, calculateGameMode } = useGameRules();
	const { getRowLength, shouldShrinkGrid } = useCategories();
	const { getBingoCardOutput } = useCardOutput();

	const gamerules = getGameRules();
	const gamemode = calculateGameMode(shouldShrinkGrid());
	const gridSize = gamerules.gridSize;
	const rowLength = getRowLength(gridSize);

	// Populate output with initial data and watch for changes
	const output = ref();
	output.value = generateOutput(getBingoCardOutput(), rowLength);

	watch(getBingoCardOutput, categories => {
		output.value = generateOutput(categories, rowLength);
	});

	// Also watch for win state - necessary for reading value on initial page load
	watch(props, () => {
		output.value = generateOutput(getBingoCardOutput(), rowLength);
	});

	function generateOutput(categories, rowLength) {
		let table = '';
		let index = 0;
		const centerCol = Math.floor(rowLength / 2);

		// Get category numbers
		const currentCategories = categories.filter(cat => (cat.isSatisfied && cat.starType !== 'free')).length;
		const totalCategories = categories.filter(cat => cat.starType !== 'free').length;

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
			const rowCells = row.map(cat => {
				let cellContent = '';

				// Category
				if (cat.entry) {
					cellContent += `~~${cat.category}~~`;
				} else {
					cellContent += cat.category;
				}

				// Entry (exclude free stars)
				if (cat.isSatisfied && !(cat.isStarTile && gamerules.star === 'free')) {
					cellContent += ` <br> **✅ ${cat.entry}**`;
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
