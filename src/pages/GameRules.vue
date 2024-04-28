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

	// When category list limit is too low, the default grid size must be small.
	// We need to inform the reset and comparisons functions of this.
	const shouldShrink = shouldShrinkGrid();

	// Initialize to standard if no browser data
	if (!areGamerulesSet.value) {
		console.log('No gamerules found.  Defaulting to standard.');
		resetGameRules('standard', false, shouldShrink);
	}

	// Shrink grid if category limit is too low.  Needs to run when changing category lists.
	if (shouldShrink) {
		setGameRule('gridSize', 'small');
	}

	// Passing gamemode from GameRulesMode to GameRulesCustom
	// We're interested in the value of the radio, not the derived gamemode from
	// calculateGameMode(), so that is only used to set the initial value.
	const gamemodeRadio = ref(calculateGameMode(shouldShrink));
</script>

<template>
	<nav class="nav-bar">
		<h1>Configure Game Rules</h1>
		<StartOver />
		<RouterLink
			v-if="isBingoCardSet"
			to="/bingo"
			class="button"
		>
			Back to Card
		</RouterLink>
		<RouterLink
			v-else
			to="/list"
			class="button"
		>
			← Go Back
		</RouterLink>
	</nav>

	<p v-if="!isBingoCardSet">
		Now to choose how you want to play!  Unless otherwise noted, these settings can be changed later.
	</p>

	<h2>Game Mode</h2>
	<GameRulesMode v-model="gamemodeRadio" />

	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom :is-custom="(gamemodeRadio === 'custom')" />

	<template v-if="!isBingoCardSet">
		<p>When you're ready, click <em>Confirm Game Rules</em> to move to the next step and refine your categories.</p>

		<nav class="btn-bar">
			<RouterLink
				to="/refine"
				class="button"
			>
				Confirm Game Rules
			</RouterLink>
		</nav>
	</template>
</template>

<style scoped>
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
