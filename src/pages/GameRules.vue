<script setup>
	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';
</script>

<template>
	<h1>Tildes Backlog Bingo</h1>
	<p>Wish to participate in the Tildes Backlog Burner event? Let's generate a bingo card for you!</p>

	<h2 class="gamemode-header">
		Game Mode
	</h2>
	<GameRulesMode />
	
	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom />

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
