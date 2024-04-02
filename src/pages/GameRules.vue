<script setup>
	import { ref } from 'vue';
	import { useGameRules } from '../composables/gamerules.js';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';

	// Passing gamemode from GameRulesMode to GameRulesCustom
	// We're interested in the value of the radio, not the derived gamemode from
	// calculateGameMode(), so that is only used to set the initial value.
	const gamemodeRadio = ref(useGameRules().calculateGameMode());
</script>

<template>
	<h1>Tildes Backlog Bingo</h1>
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
		<button class="btn">Select Categories</button>
	</RouterLink>
</template>

<style scoped>
	.gamerules-header {
		margin-top: 1.4em;
	}
	.btn {
		margin-top: 1.1em;
	}
</style>
