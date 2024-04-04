<script setup>
	import { ref, computed, onMounted} from 'vue';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useErrors } from '../composables/errors.js';

	const { getGameRules, setGameRule } = useGameRules();
	const { getCardSource } = useCategories();
	const { setError } = useErrors();

	const props = defineProps({
		isCustom: {
			type: Boolean,
			default: false
		}
	});

	const gamerules = getGameRules();
	const cardSource = getCardSource();

	// Determine grid size and set default for later comparison
	const defaultGridSize = ref(gamerules.gridSize);
	const maxGridSize = computed(() => getMaxGridSize(cardSource.categories.length));
	const maxGridLabel = computed(() => getGridLabel(maxGridSize.value));

	// Override grid size gamerule if too small to fit a 5x5
	onMounted(() => {
		if (maxGridSize.value < 5) {
			setGameRule('gridSize', maxGridLabel.value);
			defaultGridSize.value = maxGridLabel.value;
		}
	});

	// Calculate max grid size from category count
	function getMaxGridSize(catCount) {
		const acceptedSizes = [3, 5, 7];
		const maxSize = Math.floor(Math.sqrt(catCount));
		for(let i=maxSize; i>=3; i--) {
			if (acceptedSizes.includes(i)) {
				return i; // 7, 5, 3
			}
		}

		setError('Grid size appears invalid.  Are there enough categories?');
		return -1;
	}

	// Get grid label from numerical size
	function getGridLabel(size) {
		if (size >= 7) {
			return 'large';
		} else if (size >= 5) {
			return 'medium';
		} else if (size >= 3) {
			return 'small';
		}
	}
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
					<option
						v-if="maxGridSize >= 3"
						value="small"
					>
						Small (3x3)
					</option>
					<option
						v-if="maxGridSize >= 5"
						value="medium"
					>
						Medium (5x5)
					</option>
					<option
						v-if="maxGridSize >= 7"
						value="large"
					>
						Large (7x7)
					</option>
				</select>
				<p>How large of a bingo grid to generate.</p>
				<p
					v-if="gamerules.gridSize !== defaultGridSize"
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
