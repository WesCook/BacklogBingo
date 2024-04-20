<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';

	import BingoSheet from '../components/BingoSheet.vue';
	import BingoMarkdown from '../components/BingoMarkdown.vue';
	import { Fireworks } from '@fireworks-js/vue';

	const { getGameRules } = useGameRules();

	const winState = ref(false);

	const winConditionMessage = getWinConditionMessage(getGameRules().winCondition);

	// Fireworks setup
	const fireworks = ref();
	const options = ref({ opacity: 0.8 });
	let fireworksTimeout;
	const fireworksAnimationTime = 8000;

	function winUpdate(state, doFireworks=false) {
		winState.value = state;

		if (state === true && doFireworks) {
			startFireworks();
		} else {
			fireworks.value?.waitStop(); // Undefined during setup()
		}
	}

	async function startFireworks() {
		// Undefined during setup(), which prevents fireworks from firing on first load
		if (!fireworks.value) {
			return;
		}

		clearTimeout(fireworksTimeout);
		fireworks.value.start();
		fireworksTimeout = setTimeout(async () => {
			await fireworks.value?.waitStop();
		}, fireworksAnimationTime);
	}

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

	<p>That's a spiffy looking bingo card!  To win, you must complete {{ winConditionMessage }}.  You can use Ctrl + Arrow keys to navigate.</p>
	<BingoSheet @win-update="winUpdate" />

	<BingoMarkdown :win-state="winState" />

	<Fireworks
		ref="fireworks"
		:autostart="false"
		:options="options"
		class="fireworks"
	/>
</template>

<style scoped>
	.nav-bar {
		display: flex;
		justify-content: space-between;
		align-items: start;
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
