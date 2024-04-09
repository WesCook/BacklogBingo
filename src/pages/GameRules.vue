<script setup>
	import { ref } from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useBingo } from '../composables/bingo.js';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';
	import StartOver from '../components/StartOver.vue';

	const { areGamerulesSet, resetGameRules, calculateGameMode } = useGameRules();
	const { isBingoCardSet } = useBingo();

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
	<div class="nav-bar">
		<h1>Configure Game Rules</h1>
		<RouterLink
			v-if="!isBingoCardSet"
			to="/card"
		>
			<button>← Go Back</button>
		</RouterLink>
		<StartOver v-if="!isBingoCardSet" />
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
			v-if="isBingoCardSet"
			to="bingo"
		>
			<button>Back to Bingo</button>
		</RouterLink>
		<RouterLink
			v-else
			to="categories"
		>
			<button>Confirm Game Rules</button>
		</RouterLink>
	</div>
</template>

<style scoped>
	.nav-bar {
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

	.gamerules-header + fieldset {
		margin-bottom: 1.5em;
	}

	.btn-bar {
		margin-top: 1.5em;
		display: flex;
		justify-content: end;
	}
</style>
