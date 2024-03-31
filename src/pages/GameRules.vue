<script setup>
	import { ref } from 'vue';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';

	// Passing if gamemode is custom from GameRulesMode to GameRulesCustom
	// Not using calculateGameMode() because it derives its value from gamerules, which won't observe changes in DOM radios
	const isCustom = ref(false);
</script>

<template>
	<h1>Tildes Backlog Bingo</h1>
	<p>Wish to participate in the Tildes Backlog Burner event? Let's generate a bingo card for you!</p>

	<h2 class="gamemode-header">
		Game Mode
	</h2>
	<GameRulesMode @is-custom="isCustom = $event" />

	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom :is-custom="isCustom" />

	<p>When you're ready, move to the next step to select your categories. Except for grid size, these settings can be changed later.</p>
	<button class="btn">Select Categories</button>
</template>

<style scoped>
	.gamerules-header {
		margin-top: 1.4em;
	}
	.btn {
		margin-top: 1.1em;
	}
</style>
