<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';
	import StartOver from '../components/StartOver.vue';
	import { useCategories } from '../composables/categories';

	const { areGamerulesSet, resetGameRules, calculateGameMode } = useGameRules();
	const { isBingoCardSet } = useCategories();

	// Initialize to standard if no browser data
	if (!areGamerulesSet.value) {
		console.log('No gamerules found.  Defaulting to standard.');
		resetGameRules('standard');
	}

	// Passing gamemode from GameRulesMode to GameRulesCustom
	// We're interested in the value of the radio, not the derived gamemode from
	// calculateGameMode(), so that is only used to set the initial value.
	const gamemodeRadio = ref(calculateGameMode());
</script>

<template>
	<div class="top-row">
		<h1>Configure Game Rules</h1>
		<RouterLink
			v-if="!isBingoCardSet"
			to="/card"
		>
			<button>← Go back</button>
		</RouterLink>
		<StartOver />
	</div>

	<p>Now to choose how you want to play!  Unless otherwise noted, these settings can be changed later.</p>

	<h2 class="gamemode-header">
		Game Mode
	</h2>
	<GameRulesMode v-model="gamemodeRadio" />

	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom :is-custom="(gamemodeRadio === 'custom')" />

	<RouterLink to="categories">
		<button>Filter Categories</button>
	</RouterLink>
</template>

<style scoped>
	.top-row {
		display: flex;
		align-items: start;
		gap: 10px;
		justify-content: end;

		h1 {
			margin-right: auto;
		}
	}

	.gamerules-header {
		margin-top: 1.4em;
	}
</style>
