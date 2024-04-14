<script setup>
	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import BingoTile from '../components/BingoTile.vue';
	
	const { getGameRules } = useGameRules();
	const { getRowLength } = useCategories();
	const { getBingoCard } = useBingo();

	const bingoCard = getBingoCard();

	const gridSize = getGameRules().gridSize;
	const rowLength = getRowLength(gridSize);
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
		/>
	</div>
</template>

<style scoped>
	.bingo-card {
		display: grid;
		gap: clamp(0.2em, 1vw, 0.8em);
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
