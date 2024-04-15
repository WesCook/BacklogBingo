<script setup>
	const props = defineProps({
		data: {
			type: Object,
			required: true
		},
		rowLength: {
			type: Number,
			required: true
		},
		valid: {
			type: Boolean,
			default: false
		},
		win: {
			type: Boolean,
			default: false
		}
	});

	const emit = defineEmits(['edit-game', 'navigate']);

	function submitGameChange(event) {
		emit('edit-game', props.data.uuid, event.target.value);
	}

	function keyboardNavigation(event) {
		if (!event.ctrlKey || event.shiftKey) {
			return;
		}

		if (event.key === 'ArrowUp') {
			emit('navigate', props.data.uuid, -props.rowLength);
		} else if (event.key === 'ArrowDown') {
			emit('navigate', props.data.uuid, props.rowLength);
		} else if (event.key === 'ArrowLeft') {
			emit('navigate', props.data.uuid, -1);
		} else if (event.key === 'ArrowRight') {
			emit('navigate', props.data.uuid, 1);
		}
	}
</script>

<template>
	<label
		class="bingo-tile"
		:class="{ valid: valid, win: win }"
		:data-uuid="data.uuid"
	>
		<span>{{ data.name }}</span>
		<input
			:value="data.game"
			@blur="submitGameChange"
			@keyup.enter="submitGameChange"
			@keydown="keyboardNavigation"
			@focus="$event.target.select()"
		>
	</label>
</template>

<style scoped>
	/* Tile layout */
	.bingo-tile {
		display: flex;
		gap: 5px;
		flex-direction: column;
		border: 1px solid var(--border-color);
		border-radius: 10px;
		padding: clamp(0.2em, 1vw, 0.5em);
		font-size: clamp(0.8em, calc(1vw + 0.3em), 0.95em);
		text-align: center;
		background-color: var(--tone1);
	}
	.bingo-tile:focus-within {
		border-color: color-mix(in srgb, var(--foreground-color) 70%, var(--background-color));
	}

	/* Extend height to aspect ratio at different thresholds */
	@media(min-width: 400px) {
		.bingo-card[data-size="small"] .bingo-tile {
			aspect-ratio: 1;
		}
	}
	@media(min-width: 650px) {
		.bingo-card[data-size="medium"] .bingo-tile {
			aspect-ratio: 1;
		}
	}

	/* Tile states */
	.valid {
		background-color: var(--tone4);
	}
	.win {
		background-color: var(--tone3);
	}

	/* Text boxes */
	input {
		margin-top: auto;
		min-width: 10ch;
		width: 100%;
		background-color: color-mix(in srgb, var(--background-shaded) 92%, var(--foreground-color));
	}
	input:focus {
		outline: 1px solid color-mix(in srgb, var(--foreground-color) 60%, var(--background-color));
	}
</style>
