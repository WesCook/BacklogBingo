<script setup>
	import { useGameRules } from '../composables/gamerules.js';

	const { getGameRules, setGameRule } = useGameRules();
	const gamerules = getGameRules();

	const props = defineProps({
		isCustom: {
			type: Boolean,
			default: false
		}
	});
</script>

<template>
	<fieldset
		class="gamerules"
		:disabled="!props.isCustom"
	>
		<ul>
			<li>
				<h3>Win Condition</h3>
				<select
					id="winCondition"
					:value="gamerules.winCondition"
					@change="setGameRule($event.target.id, $event.target.value)"
				>
					<option value="row-col">Row or column</option>
					<option value="row-col-diag">Row, column, or diagonal</option>
					<option value="blackout">Blackout (every tile)</option>
				</select>
				<p>The required pattern for completing a bingo.</p>
			</li>
			<li>
				<h3>Grid Size</h3>
				<select
					id="gridSize"
					:value="gamerules.gridSize"
					@change="setGameRule($event.target.id, $event.target.value)"
				>
					<option value="small">Small (3x3)</option>
					<option value="medium">Medium (5x5)</option>
					<option value="large">Large (7x7)</option>
				</select>
				<p>How large of a bingo grid to generate.</p>
				<p
					v-if="gamerules.gridSize !== 'medium'"
					class="notice"
				>
					This setting cannot be customized once your card is generated.
				</p>
			</li>
			<li>
				<h3>Golf Rules</h3>
				<label>
					<input
						id="golf"
						type="checkbox"
						:checked="gamerules.golf"
						@change="setGameRule($event.target.id, $event.target.checked)"
					>
					<span>Enable golf rules</span>
				</label>
				<p>Golf rules allow games to apply to multiple categories.  This lets you focus on playing strategically.</p>
			</li>
			<li>
				<h3>Star Tile</h3>
				<select
					id="star"
					:value="gamerules.star"
					@change="setGameRule($event.target.id, $event.target.value)"
				>
					<option value="disabled">Disabled</option>
					<option value="free">Free Space</option>
					<option value="wildcard">Wildcard</option>
				</select>
				<p>
					The center tile is often marked as a freebie.  This lets you customize its behaviour.<br>
					A free space counts as a completed game, while a wildcard allows any game with no specific category.
				</p>
			</li>
			<li>
				<h3>Lock Random</h3>
				<label>
					<input
						id="lockRandom"
						type="checkbox"
						:checked="gamerules.lockRandom"
						@change="setGameRule($event.target.id, $event.target.checked)"
					>
					<span>Lock random</span>
				</label>
				<p>The random button helps you choose a category to focus on.  This setting locks the button until you satisfy the chosen category, for a more restrictive game style.</p>
			</li>
			<li>
				<h3>Allow Similar</h3>
				<label>
					<input
						id="allowSimilar"
						type="checkbox"
						:checked="gamerules.allowSimilar"
						@change="setGameRule($event.target.id, $event.target.checked)"
					>
					<span>Allow similar</span>
				</label>
				<p>The generator will try to prevent similar categories from being chosen together unless this is enabled.</p>
				<p
					v-if="gamerules.allowSimilar"
					class="notice"
				>
					This setting cannot be customized once your card is generated.
				</p>
			</li>
		</ul>
	</fieldset>
</template>

<style scoped>
	.gamerules {
		padding: 20px;
		margin-bottom: 25px;
		background-color: color-mix(in srgb, var(--background-shaded) 90%, var(--foreground-color));
		opacity: 1;
		transition: opacity 0.2s ease;

		/* Layout */
		ul {
			display: flex;
			flex-direction: column;
			gap: 15px;
			padding: 0;
		}

		li {
			display: grid;
			grid-template-areas:
				"title input"
				"desc desc"
				"notice notice";
			grid-template-columns: 2.5fr 200px;
			align-items: center;
			row-gap: 5px;
		}

		/* Column view on mobile */
		@media (max-width: 800px) {
			ul {
				gap: 20px;
			}

			li {
				grid-template-areas:
					"title"
					"desc"
					"input"
					"notice";
				row-gap: 8px;
				grid-template-columns: 1fr;
			}
		}

		/* Inputs */
		select,
		label {
			grid-area: input;
			background-color: var(--background-shaded);
			font-size: 0.9rem;
			padding: 8px;
		}

		/* Text content */
		h3 {
			grid-area: title;
			margin: 0;
		}

		p {
			grid-area: desc;
			margin: 0;
			font-size: 0.9em;
		}

		.notice {
			grid-area: notice;
			color: #e59400;
			font-weight: bold;
		}

		/* Bold ticked checkbox labels for extra visibility */
		input[type='checkbox']:checked + span {
			font-weight: bold;
		}

		/* Fade out further when disabled, and ensure consistency in controls across browsers */
		&:disabled,
		&:disabled select,
		&:disabled label {
			opacity: 0.7;
		}
	}
</style>
