<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import BingoTile from '../components/BingoTile.vue';
	
	const { getGameRules } = useGameRules();
	const { getRowLength } = useCategories();
	const { getBingoCard } = useBingo();

	const bingoCard = getBingoCard();
	const bingoValues = ref(new Map());

	const gridSize = getGameRules().gridSize;
	const rowLength = getRowLength(gridSize);

	function editGame(id, text) {
		bingoValues.value.set(id, text);
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
			:valid="!!bingoValues.get(tile.uuid)"
			@edit-game="editGame"
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
</style>
