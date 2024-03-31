<script setup>
	import { ref, inject, watch } from 'vue';

	import GameRulesMode from '../components/GameRulesMode.vue';
	import GameRulesCustom from '../components/GameRulesCustom.vue';

	const emit = defineEmits(['gamerule-update']);

	// Predefined game modes
	const defaultGameModes = {
		'standard': {
			winCondition: 'row-col-diag',
			gridSize: 'medium',
			golf: false,
			lockRandom: false,
			allowSimilar: false,
			star: 'wildcard'
		},
		'golf': {
			winCondition: 'blackout',
			gridSize: 'medium',
			golf: true,
			lockRandom: false,
			allowSimilar: false,
			star: 'free'
		}
	};

	const gamerules = inject('gamerules');
	const gamemode = ref(getGameMode());

	// Update gamerules when gamemode changes
	watch(gamemode, newVal => {
		if (newVal === 'custom') {
			return;
		}
		for (const rule in defaultGameModes[newVal]) {
			emit('gamerule-update', rule, defaultGameModes[newVal][rule]);
		}
	});

	// Find game mode by comparing current gamerules against defaults
	// We could save the game mode directly, but this allows us to change the defaults later without creating conflicts
	// They'll simply be converted into custom rules
	function getGameMode() {
		if (JSON.stringify(gamerules) === JSON.stringify(defaultGameModes.standard)) {
			return 'standard';
		} else if (JSON.stringify(gamerules) === JSON.stringify(defaultGameModes.golf)) {
			return 'golf';
		}
		return 'custom';
	}
</script>

<template>
	<h1>Tildes Backlog Bingo</h1>
	<p>Wish to participate in the Tildes Backlog Burner event? Let's generate a bingo card for you!</p>

	<h2 class="gamemode-header">
		Game Mode
	</h2>
	<GameRulesMode
		@gamemode-update="gamemode = $event"
	/>

	<h2 class="gamerules-header">
		Game Rules
	</h2>
	<GameRulesCustom
		:gamemode="gamemode"
		@gamerule-update="(rule, value) => emit('gamerule-update', rule, value)"
	/>

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
