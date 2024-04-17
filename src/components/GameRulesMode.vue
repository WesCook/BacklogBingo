<script setup>
	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	const { resetGameRules } = useGameRules();
	const { shouldShrinkGrid } = useCategories();
	const { isBingoCardSet } = useBingo();

	const gamemodeRadio = defineModel({ type: String });
</script>

<template>
	<div class="gamemode">
		<label>
			<input
				v-model="gamemodeRadio"
				type="radio"
				name="gamemode-radio"
				value="standard"
				@change="resetGameRules('standard', isBingoCardSet.value, shouldShrinkGrid());"
			>
			<h3>Standard</h3>
			<p>The main way to play.  Complete a row, column, or diagonal to win.  Each entry only counts for one category.</p>
		</label>
		<label>
			<input
				v-model="gamemodeRadio"
				type="radio"
				name="gamemode-radio"
				value="golf"
				@change="resetGameRules('golf', isBingoCardSet.value, shouldShrinkGrid());"
			>
			<h3>Golf</h3>
			<p>Focus on strategy, and try to finish a whole board with as few unique entries as possible.</p>
		</label>
		<label>
			<input
				v-model="gamemodeRadio"
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

		/* Subtly darken selected game mode */
		label:has(input[type="radio"]:checked) {
			filter: grayscale(15%);
		}

		/* Color strips */
		label:nth-of-type(1) {background-color: var(--tone1);}
		label:nth-of-type(2) {background-color: var(--tone2);}
		label:nth-of-type(3) {background-color: var(--tone3);}
	}
</style>
