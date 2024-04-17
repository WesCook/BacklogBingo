<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';
	import StartOver from '../components/StartOver.vue';

	const { areGamerulesSet, setGameRule, resetGameRules, calculateGameMode } = useGameRules();
	const { shouldShrinkGrid } = useCategories();
	const { isBingoCardSet } = useBingo();

	// When card source category limit is too low, the default grid size must be small.
	// We need to inform the reset and comparisons functions of this.
	const shouldShrink = shouldShrinkGrid();

	// Initialize to standard if no browser data
	if (!areGamerulesSet.value) {
		console.log('No gamerules found.  Defaulting to standard.');
		resetGameRules('standard', false, shouldShrink);
	}

	// Shrink grid if category limit is too low.  Needs to run when changing card sources.
	if (shouldShrink) {
		setGameRule('gridSize', 'small');
	}

	// Passing gamemode from GameRulesMode to GameRulesCustom
	// We're interested in the value of the radio, not the derived gamemode from
	// calculateGameMode(), so that is only used to set the initial value.
	const gamemodeRadio = ref(calculateGameMode(shouldShrink));
</script>

<template>
	<div class="nav-bar">
		<h1>Configure Game Rules</h1>
		<StartOver />
		<RouterLink
			:to="(isBingoCardSet) ? '/bingo' : '/card'"
			class="button"
		>
			← Go Back
		</RouterLink>
	</div>

	<p v-if="!isBingoCardSet">
		Now to choose how you want to play!  Unless otherwise noted, these settings can be changed later.
	</p>

	<h2>Game Mode</h2>
	<GameRulesMode v-model="gamemodeRadio" />

	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom :is-custom="(gamemodeRadio === 'custom')" />

	<p v-if="!isBingoCardSet">
		When you're ready, click <em>Confirm Game Rules</em> to move to the next step and refine your categories.
	</p>

	<div class="btn-bar">
		<RouterLink
			v-if="!isBingoCardSet"
			to="categories"
			class="button"
		>
			Confirm Game Rules
		</RouterLink>
	</div>
</template>

<style scoped>
	.nav-bar {
		display: flex;
		align-items: start;
		justify-content: end;
		gap: 10px;

		h1 {
			margin-right: auto;
		}
	}

	.gamerules-header {
		margin-top: 1.4em;
	}

	.gamerules-header + fieldset {
		margin-bottom: 1.5em;
	}

	.btn-bar {
		margin-top: 1.5em;
		display: flex;
		justify-content: end;
	}
</style>
