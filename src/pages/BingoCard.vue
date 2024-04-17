<script setup>
	import { useGameRules } from '../composables/gamerules.js';

	import BingoSheet from '../components/BingoSheet.vue';
	import BingoMarkdown from '../components/BingoMarkdown.vue';

	const { getGameRules } = useGameRules();

	const winConditionMessage = getWinConditionMessage(getGameRules().winCondition);

	function getWinConditionMessage(winCondition) {
		if (winCondition === 'row-col-diag') {
			return 'a row, column, or diagonal';
		} else if (winCondition === 'row-col') {
			return 'a row or column';
		} else if (winCondition === 'blackout') {
			return 'every tile (a blackout)';
		}
	}
</script>

<template>
	<div class="nav-bar">
		<h1>Bingo Card</h1>
		<RouterLink
			to="/gamerules"
			class="button"
		>
			Edit Rules
		</RouterLink>
	</div>

	<p>That's a spiffy looking Bingo card!  To win, you must complete {{ winConditionMessage }}.  You can use Ctrl + Arrow keys to navigate.</p>
	<BingoSheet />

	<p>And here's your Markdown-formatted card for easy sharing.</p>
	<BingoMarkdown />
</template>

<style scoped>
	.nav-bar {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}
</style>
