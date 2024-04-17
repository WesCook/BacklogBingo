<script setup>
	import { ref} from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';

	const { getGameRules, setGameRule } = useGameRules();
	const { isCardSourceSet, getCardSourceCatNumber, getMaxGridSize } = useCategories();
	const { isBingoCardSet } = useBingo();

	const props = defineProps({
		isCustom: {
			type: Boolean,
			default: false
		}
	});

	// Save default grid size for later comparison (post-transform)
	const gamerules = getGameRules();
	const defaultGridSize = ref(gamerules.gridSize);

	// Store grid size for conditional logic if configuring from a card source
	let maxGridSize;
	if (isCardSourceSet.value) {
		maxGridSize = getMaxGridSize(getCardSourceCatNumber());
	}
</script>

<template>
	<fieldset
		class="gamerules"
		:disabled="!isCustom"
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
					:disabled="isBingoCardSet"
					@change="setGameRule($event.target.id, $event.target.value)"
				>
					<option
						v-if="isBingoCardSet || (isCardSourceSet && maxGridSize >= 3)"
						value="small"
					>
						Small (3x3)
					</option>
					<option
						v-if="isBingoCardSet || (isCardSourceSet && maxGridSize >= 5)"
						value="medium"
					>
						Medium (5x5)
					</option>
					<option
						v-if="isBingoCardSet || (isCardSourceSet && maxGridSize >= 7)"
						value="large"
					>
						Large (7x7)
					</option>
				</select>
				<p>How large of a bingo grid to generate.</p>
				<p
					v-if="isBingoCardSet"
					class="notice"
				>
					This setting cannot be changed as your card has already been generated.
				</p>
				<p
					v-else-if="gamerules.gridSize !== defaultGridSize"
					class="notice"
				>
					This setting cannot be changed once your card is generated.
				</p>
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
					A free space counts as a completed tile, while a wildcard allows any type of entry with no specific category.
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
				<h3>Allow Duplicates</h3>
				<label>
					<input
						id="allowDuplicates"
						type="checkbox"
						:checked="gamerules.allowDuplicates"
						@change="setGameRule($event.target.id, $event.target.checked)"
					>
					<span>Allow duplicates</span>
				</label>
				<p>Allow the same entry to be used in multiple categories.  This enables playing by golf rules, where you try to optimize overlapping category.</p>
			</li>
			<li>
				<h3>Allow Similar</h3>
				<label>
					<input
						id="allowSimilar"
						type="checkbox"
						:checked="gamerules.allowSimilar"
						:disabled="isBingoCardSet"
						@change="setGameRule($event.target.id, $event.target.checked)"
					>
					<span>Allow similar</span>
				</label>
				<p>The generator will try to prevent similar categories from being chosen together unless this is enabled.</p>
				<p
					v-if="isBingoCardSet"
					class="notice"
				>
					This setting cannot be changed as your card has already been generated.
				</p>
				<p
					v-else-if="gamerules.allowSimilar"
					class="notice"
				>
					This setting cannot be changed once your card is generated.
				</p>
			</li>
		</ul>
	</fieldset>
</template>

<style scoped>
	.gamerules {
		padding: 20px;
		background-color: color-mix(in srgb, var(--background-shaded) 90%, var(--foreground-color));
		border: 1px solid var(--border-color);
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

		/* Fade rule when disabled */
		li:has(:is(input,select):disabled) {
			opacity: 70%;
		}

		/* Fade out further when disabled, and ensure consistency in controls across browsers */
		&:disabled,
		&:disabled select,
		&:disabled label {
			opacity: 70%;
		}
	}
</style>
