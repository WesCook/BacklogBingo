<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';
	import StartOver from '../components/StartOver.vue';
	import ExportData from '../components/ExportData.vue';
	import IconLeftArrow from '../components/icons/IconLeftArrow.vue';

	const { areGamerulesSet, resetGameRules, setGameRule, calculateGameMode } = useGameRules();
	const { getCategoryList, shouldShrinkGrid } = useCategories();
	const { isBingoCardSet } = useBingo();

	// When category list limit is too low, the default grid size must be small.
	// We need to inform the reset and comparisons functions of this.
	const shouldShrink = shouldShrinkGrid();

	// Initialize to standard if no browser data
	if (!areGamerulesSet.value) {
		console.log('No gamerules found.  Defaulting to standard.');
		resetGameRules('standard', false, shouldShrink);

		// Parse category list for gamerule overrides, and apply them
		const categoryRules = getCategoryList().gamerules;
		if (categoryRules) {
			for (const rule of Object.keys(categoryRules)) {
				console.log(`Setting game rule '${rule}' to '${categoryRules[rule]}'.`);
				setGameRule(rule, categoryRules[rule]);
			}
		}
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
		<h1>Settings</h1>
		<StartOver />
		<ExportData v-if="isBingoCardSet" />
		<RouterLink
			v-if="isBingoCardSet"
			to="/bingo"
			class="btn"
		>
			<IconLeftArrow /> Back to Card
		</RouterLink>
		<RouterLink
			v-else
			to="/list"
			class="btn"
		>
			<IconLeftArrow /> Go Back
		</RouterLink>
	</nav>

	<p v-if="!isBingoCardSet">
		Now to choose how you want to play!
	</p>

	<h2>Game Mode</h2>
	<GameRulesMode v-model="gamemodeRadio" />

	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom :is-custom="(gamemodeRadio === 'custom')" />

	<template v-if="!isBingoCardSet">
		<nav class="nav-bar">
			<p class="left">
				When you're ready, click <em>Confirm Settings</em> to move to the next step and refine your categories.
			</p>

			<RouterLink
				to="/refine"
				class="btn"
			>
				Confirm Settings
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
</style>
