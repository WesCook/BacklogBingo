<script setup>
	import { ref, inject, watch } from 'vue';

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

	// Update gamerules when gamemode changes
	watch(gamemode, newVal => {
		if (newVal === 'custom') {
			return;
		}
		for (const rule in defaultGameModes[newVal]) {
			emit('gamerule-update', rule, defaultGameModes[newVal][rule]);
		}
	});
</script>

<template>
	<div class="gamemode">
		<label>
			<input
				v-model="gamemode"
				type="radio"
				name="gamemode-radio"
				value="standard"
			>
			<h3>Standard</h3>
			<p>The main way to play.  Complete a row, column, or diagonal to win.  Each game only counts for one category.</p>
		</label>
		<label>
			<input
				v-model="gamemode"
				type="radio"
				name="gamemode-radio"
				value="golf"
			>
			<h3>Golf</h3>
			<p>Focus on strategy, and try to finish a whole board playing as few unique titles as possible.</p>
		</label>
		<label>
			<input
				v-model="gamemode"
				type="radio"
				name="gamemode-radio"
				value="custom"
			>
			<h3>Custom</h3>
			<p>Customize the ruleset to your liking.</p>
		</label>
	</div>
</template>

<style scoped>
	.gamemode {
		/* Layout */
		label {
			display: grid;
			grid-template-areas:
				"gm-radio gm-title"
				"gm-radio gm-desc";
			grid-template-columns: auto 1fr;
			align-items: center;
			padding: 25px 12px;
			column-gap: 15px;
			row-gap: 5px;
		}

		/* Inputs */
		input[type="radio"] {
			grid-area: gm-radio;
			height: 30px;
			width: 30px;
			justify-self: center;
		}

		/* Text content */
		h3 {
			grid-area: gm-title;
			margin: 0;
		}

		p {
			grid-area: gm-desc;
			margin: 0;
		}

		/* Animate radios when hovering */
		label input[type="radio"] {
			transition: transform 0.15s ease-in;
		}
		label:hover input[type="radio"] {
			transform: scale(1.12);
		}

		/* Color strips */
		label:nth-of-type(1) {background-color: var(--tone1);}
		label:nth-of-type(2) {background-color: var(--tone2);}
		label:nth-of-type(3) {background-color: var(--tone3);}
	}
</style>
