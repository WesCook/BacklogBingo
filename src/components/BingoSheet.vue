<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import BingoTile from '../components/BingoTile.vue';
	import { Fireworks } from '@fireworks-js/vue';
	
	const { getGameRules } = useGameRules();
	const { getRowLength } = useCategories();
	const { getBingoCard, setGame } = useBingo();

	const gamerules = getGameRules();
	const bingoCard = getBingoCard();

	const gridSize = gamerules.gridSize;
	const rowLength = getRowLength(gridSize);

	// Populate local map for UI changes, win checking, etc
	const completionMap = ref(new Map());
	bingoCard.categories.forEach(cat => {
		completionMap.value.set(cat.uuid, Boolean(cat.game));
	});

	// Array of all arrays of possible win conditions
	const winStates = getWinStates(gamerules.winCondition);

	// Set of all UUIDs making up winning pattern
	const winningTiles = ref(getWinningTiles());

	// Fireworks setup
	const fireworks = ref();
	const options = ref({ opacity: 0.8 });
	let fireworksTimeout;
	const fireworksAnimationTime = 8000;

	const setsAreEqual = (set1, set2) => set1.size === set2.size && [...set1].every(value => set2.has(value));

	// Update bingo sheet values
	function editGameEvent(uuid, game) {
		setGame(uuid, game); // Update composable and browser storage
		completionMap.value.set(uuid, Boolean(game)); // Update completion map

		// Update winning tiles and play fireworks
		const newWinningTiles = getWinningTiles();
		if (!setsAreEqual(newWinningTiles, winningTiles.value)) {
			winningTiles.value = newWinningTiles;
			if (winningTiles.value.size) {
				startFireworks();
			}
		}
	}

	// Returns list of all UUIDs in set of winning tiles
	// If blank set is returned, then it's not a victory
	function getWinningTiles() {
		const winningTiles = new Set();
		for (const winState of winStates) { // Check all possible win states
			let match = true;
			for (const uuid of winState) { // Check all UUIDs in current win state
				if (!completionMap.value.get(uuid)) {
					match = false;
					break;
				}
			}

			if (match) {
				for (const uuid of winState) {
					winningTiles.add(uuid);
				}
			}
		}

		return winningTiles;
	}

	function getWinStates(winCondition) {
		const winStates = [];
		let currentReq;

		// Rows
		currentReq = [];
		if (winCondition === 'row-col' || winCondition === 'row-col-diag') {
			bingoCard.categories.forEach((tile, index) => {
				currentReq.push(tile.uuid);
				if ((index + 1) % rowLength === 0) {
					winStates.push(currentReq);
					currentReq = [];
				}
			});
		}

		// Cols
		currentReq = [];
		if (winCondition === 'row-col' || winCondition === 'row-col-diag') {
			for (let col = 0; col < rowLength; col++) {
				for (let row = 0; row < rowLength; row++) {
					const index = col + row * rowLength;
					const tile = bingoCard.categories[index];
					currentReq.push(tile.uuid);
				}
				winStates.push(currentReq);
				currentReq = [];
			}
		}

		// Diagonals
		if (winCondition === 'row-col-diag') {
			// Top-left to bottom-right
			currentReq = [];
			for (let i = 0; i < rowLength * rowLength; i += rowLength + 1) {
				const tile = bingoCard.categories[i];
				currentReq.push(tile.uuid);
			}
			winStates.push(currentReq);

			// Top-right to bottom-left
			currentReq = [];
			for (let i = rowLength - 1; i < rowLength * rowLength - 1; i += rowLength - 1) {
				const tile = bingoCard.categories[i];
				currentReq.push(tile.uuid);
			}
			winStates.push(currentReq);
		}


		// Blackout
		if (winCondition === 'blackout') {
			currentReq = [];
			bingoCard.categories.forEach(tile => {
				currentReq.push(tile.uuid);
			});
			winStates.push(currentReq);
		}

		return winStates;
	}

	// Get index of tile from uuid, then calculate the offset and focus new tile
	function keyboardNavigation(uuid, offset) {
		const index = bingoCard.categories.findIndex(cat => cat.uuid === uuid);
		const nextTile = bingoCard.categories[index + offset];
		if (nextTile) {
			const elem = document.querySelector(`.bingo-tile[data-uuid='${nextTile.uuid}']`);
			elem.focus();
		}
	}

	async function startFireworks() {
		clearTimeout(fireworksTimeout);
		fireworks.value.start();
		fireworksTimeout = setTimeout(async () => {
			await fireworks.value.waitStop();
		}, fireworksAnimationTime);
	}
</script>

<template>
	<Fireworks
		ref="fireworks"
		:autostart="false"
		:options="options"
		class="fireworks"
	/>

	<div
		class="bingo-card"
		:class="{'data-size': gridSize}"
		:style="{'--rows': rowLength}"
		:data-size="gridSize"
	>
		<BingoTile
			v-for="tile in bingoCard.categories"
			:key="tile.uuid"
			:data="tile"
			:row-length="rowLength"
			:valid="completionMap.get(tile.uuid)"
			:win="winningTiles.has(tile.uuid)"
			@edit-game="editGameEvent"
			@navigate="keyboardNavigation"
		/>
	</div>
</template>

<style scoped>
	.bingo-card {
		display: grid;
		gap: clamp(0.2em, 1.3vw, 0.9em);
		overflow-x: auto;
		padding-bottom: 8px;
		grid-template-columns: repeat(var(--rows), 1fr);
	}

	@media(min-width: 900px) {
		.bingo-card[data-size="large"] {
			/* Normally rows are implicitly created.  This overrides them with a set size, so they share their height across all tiles. */
			grid-template-rows: repeat(var(--rows), 1fr);
		}
	}

	.fireworks {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
		pointer-events: none;
	}
</style>
