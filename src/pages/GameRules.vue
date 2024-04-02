<script setup>
	import { ref } from 'vue';
	import { useGameRules } from '../composables/gamerules.js';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';
	import StartOver from '../components/StartOver.vue';

	// Passing gamemode from GameRulesMode to GameRulesCustom
	// We're interested in the value of the radio, not the derived gamemode from
	// calculateGameMode(), so that is only used to set the initial value.
	const gamemodeRadio = ref(useGameRules().calculateGameMode());
</script>

<template>
	<div class="top-row">
		<h1>Tildes Backlog Bingo</h1>
		<RouterLink to="/card"><button>← Go back</button></RouterLink>
		<StartOver />
	</div>

	<p>Wish to participate in the Tildes Backlog Burner event? Let's generate a bingo card for you!</p>

	<h2 class="gamemode-header">
		Game Mode
	</h2>
	<GameRulesMode v-model="gamemodeRadio" />

	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom :is-custom="(gamemodeRadio === 'custom')" />

	<p>When you're ready, move to the next step to select your categories. Except for grid size, these settings can be changed later.</p>

	<RouterLink to="categories">
		<button class="btnCategories">Select Categories</button>
	</RouterLink>
</template>

<style scoped>
	.top-row {
		display: flex;
		align-items: start;
		gap: 10px;
		justify-content: end;
		& h1 {
			margin-right: auto;
		}
	}

	.gamerules-header {
		margin-top: 1.4em;
	}

	.btnCategories {
		margin-top: 1.1em;
	}
</style>
