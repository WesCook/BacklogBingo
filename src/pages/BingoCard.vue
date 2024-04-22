<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useBingo } from '../composables/bingo.js';

	import BingoSheet from '../components/BingoSheet.vue';
	import BingoMarkdown from '../components/BingoMarkdown.vue';
	import { Fireworks } from '@fireworks-js/vue';

	const { getGameRules } = useGameRules();
	const { getRevealAnimation, setRevealAnimation } = useBingo();

	const doBingoAnimation = getRevealAnimation();

	////////////////
	// Win Update //
	////////////////

	const winState = ref(false);
	function winUpdate(state, doFireworks=false) {
		winState.value = state;

		if (state === true && doFireworks) {
			startFireworks();
		} else {
			fireworks.value?.waitStop(); // Undefined during setup()
		}
	}

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

	///////////////
	// Fireworks //
	///////////////

	const fireworks = ref();
	const options = ref({ opacity: 0.8 });
	let fireworksTimeout;

	async function startFireworks() {
		// Undefined during setup(), which prevents fireworks from firing on first load
		if (!fireworks.value) {
			return;
		}

		clearTimeout(fireworksTimeout);
		fireworks.value.start();
		fireworksTimeout = setTimeout(async () => {
			await fireworks.value?.waitStop();
		}, 8000); // Fireworks animation time
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

	<p v-if="doBingoAnimation">
		Now let's find out which categories were chosen!
	</p>
	<p v-else>
		That's a spiffy looking bingo card!  To win, you must finish {{ winConditionMessage }}.  You can use Ctrl + Arrow keys to navigate.
	</p>
	<BingoSheet @win-update="winUpdate" />

	<button
		v-if="doBingoAnimation"
		class="skip-btn"
		@click="setRevealAnimation(false)"
	>
		Skip Animation
	</button>

	<BingoMarkdown
		v-if="!doBingoAnimation"
		:win-state="winState"
	/>

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

	.skip-btn {
		display: flex;
  		margin: 0 auto 1em auto;
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
