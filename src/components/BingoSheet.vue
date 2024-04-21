<script setup>
	import { ref, computed, watch } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';
	import { shuffleArray } from '../utils/object-utils.js';

	import BingoTile from '../components/BingoTile.vue';

	const emit = defineEmits(['win-update']);

	const { getGameRules } = useGameRules();
	const { getRowLength } = useCategories();
	const { getBingoCard, getStarTile, updateEntry, getRevealAnimation, setRevealAnimation } = useBingo();

	const gamerules = getGameRules();
	const bingoCard = getBingoCard();

	const gridSize = gamerules.gridSize;
	const rowLength = getRowLength(gridSize);

	// Populate local map for UI changes, win checking, etc
	const completionMap = ref(new Map());
	bingoCard.categories.forEach(cat => {
		completionMap.value.set(cat.uuid, Boolean(cat.entry));
	});

	// Same values as completionMap, but overrides free star tile to true
	const completionMapStar = computed(() => {
		if (gamerules.star !== 'free') {
			return completionMap.value;
		}

		// Duplicate map by value, to avoid mutating original
		const completionMapNew = new Map();
		completionMap.value.forEach((value, key) => {
			completionMapNew.set(key, value);
		});

		const starUUID = getStarTile();
		completionMapNew.set(starUUID, true);

		return completionMapNew;
	});

	// Set of all UUIDs with duplicate entries
	const duplicateTiles = ref(getDuplicateTiles());

	// Win detection
	const winStates = getWinStates(gamerules.winCondition); // Array of all arrays of possible win conditions
	const winningTiles = ref(new Set()); // Set of all UUIDs making up winning pattern
	checkWin();


	// Reveal animation
	const doBingoAnimation = getRevealAnimation();
	const revealMap = ref(new Map());

	// Populate map
	bingoCard.categories.forEach(cat => {
		revealMap.value.set(cat.uuid, !doBingoAnimation.value);
	});

	// Start animation
	if (doBingoAnimation.value) {
		revealAnimStart();
	}

	// Skip animation if low motion is set for accessibility
	const reducedMotion = matchMedia('(prefers-reduced-motion)').matches;
	if (reducedMotion) {
		revealAnimEnd();
	}

	// Stop animation if skip button is clicked
	watch(doBingoAnimation, (newState, prevState) => {
		if (prevState === true && newState === false) {
			revealAnimEnd();
		}
	});


	// Update bingo sheet values
	function editEntryEvent(uuid, entry) {
		updateEntry(uuid, entry); // Update composable and browser storage
		completionMap.value.set(uuid, Boolean(entry)); // Update completion map
		duplicateTiles.value = getDuplicateTiles(); // Update duplicates set
		checkWin(); // Updates winningTiles, plays fireworks, and emits event
	}

	function getDuplicateTiles() {
		const seenEntries = new Set();
		const duplicateUUIDs = new Set();

		bingoCard.categories.forEach(cat => {
			// Ignore empty strings and undefined
			if (!cat.entry) {
				return;
			}
			const entry = cat.entry.toLowerCase();

			// Make list of entries we've seen before.  If a dupe is found, add all UUIDs with that entry to dupes list
			if (seenEntries.has(entry)) {
				const uuids = bingoCard.categories.filter(cardCat => String(cardCat.entry).toLowerCase() === entry).map(cardCat => cardCat.uuid);
				uuids.forEach(uuid => duplicateUUIDs.add(uuid));
			} else {
				seenEntries.add(entry);
			}
		});

		return duplicateUUIDs;
	}

	// Checks if any win conditions are met
	// Has side effects.  Updates winningTiles Set, and emits win state to parent
	function checkWin() {
		const newWinningTiles = getWinningTiles();
		
		// Winning tiles found means at least one winning pattern was detected
		if (newWinningTiles.size) {
			// Fireworks play only when number of winning tiles has gone up
			if (newWinningTiles.size > winningTiles.value.size) {
				emit('win-update', true, true);
			} else {
				emit('win-update', true);
			}
		} else { // Tiles were removed that undid the win
			emit('win-update', false);
		}

		winningTiles.value = newWinningTiles;
	}

	// Returns list of all UUIDs in set of winning tiles
	// If blank set is returned, then it's not a victory
	function getWinningTiles() {
		const winningTiles = new Set();
		for (const winState of winStates) { // Check all possible win states
			let match = true;
			for (const uuid of winState) { // Check all UUIDs in current win state
				if (!completionMapStar.value.get(uuid) || (!gamerules.allowDuplicates && duplicateTiles.value.has(uuid))) {
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

	// Returns 'free' or 'wildcard' for center tile if enabled
	function isStarTile(uuid) {
		if (gamerules.star === 'disabled') {
			return;
		}

		const starUUID = getStarTile();
		if (uuid === starUUID) {
			return gamerules.star;
		}

		return '';
	}

	// Play animation of revealing all tiles
	async function revealAnimStart() {
		// Shuffle reveal map into random order, except with the middle tile at the end
		const middleIndex = Math.floor(bingoCard.categories.length / 2);
		const middleTile = bingoCard.categories[middleIndex].uuid;
		const randomUUIDs = shuffleArray([...revealMap.value.keys()].filter(uuid => uuid !== middleTile));
		randomUUIDs.push(middleTile, false);

		// Loop through keys and reveal tiles in increasing speed
		const delay = 1400;
		const speedUp = 0.04; // Speed up per iteration
		for (let i=0; i<randomUUIDs.length; i++) {
			const uuid = randomUUIDs[i];
			if (i === randomUUIDs.length - 2) {
				await new Promise(resolve => setTimeout(resolve, 1200)); // Dramatically delay last item
			} else {
				await new Promise(resolve => setTimeout(resolve, Math.max(400, delay - delay * speedUp * i)));
			}
			revealMap.value.set(uuid, true);
		}
		setRevealAnimation(false); // Remove skip button
	}

	// Reveal all tiles immediately and remove skip button
	function revealAnimEnd() {
		revealMap.value.forEach((_value, key, map) => {
			map.set(key, true);
		});
		setRevealAnimation(false);
	}

	// Get index of tile from uuid, then calculate the offset and focus new tile
	function keyboardNavigation(uuid, offset) {
		const getTile = (uuid, offset) =>  {
			const index = bingoCard.categories.findIndex(cat => cat.uuid === uuid);
			return bingoCard.categories[index + offset];
		};

		// Skip over free star tile
		let nextTile = getTile(uuid, offset);
		if (gamerules.star === 'free' && nextTile?.uuid === getStarTile()) {
			nextTile = getTile(uuid, offset * 2);
		}

		if (nextTile) {
			const elem = document.querySelector(`.bingo-tile[data-uuid='${nextTile.uuid}']`);
			elem.focus();
		}
	}
</script>

<template>
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
			:star="isStarTile(tile.uuid)"
			:valid="completionMapStar.get(tile.uuid)"
			:win="winningTiles.has(tile.uuid)"
			:dupe="!gamerules.allowDuplicates && duplicateTiles.has(tile.uuid)"
			:unrevealed="!revealMap.get(tile.uuid)"
			@edit-entry="editEntryEvent"
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
		margin: 2em 0 1.5em 0;
	}

	@media(min-width: 900px) {
		.bingo-card[data-size="large"] {
			/* Normally rows are implicitly created.  This overrides them with a set size, so they share their height across all tiles. */
			grid-template-rows: repeat(var(--rows), 1fr);
		}
	}
</style>
