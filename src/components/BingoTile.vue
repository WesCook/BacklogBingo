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
		},
		dupe: {
			type: Boolean,
			default: false
		}
	});

	const emit = defineEmits(['edit-entry', 'navigate']);

	function submitEntryChange(event) {
		let entry = event.target.value;
		entry = entry.trim();
		emit('edit-entry', props.data.uuid, entry);
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
		:class="{ valid, win, dupe }"
		:data-uuid="data.uuid"
	>
		<span>{{ data.cat }}</span>
		<span
			v-if="dupe"
			class="dupe-message"
		>Duplicate Entry</span>
		<input
			:value="data.entry"
			@blur="submitEntryChange"
			@keyup.enter="submitEntryChange"
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
	.dupe {
		background-color: color-mix(in srgb, var(--tone1) 40%, var(--background-shaded));

		input:not(:focus) {
			animation-name: colorFade;
			animation-duration: 4s;
			animation-timing-function: linear;
			animation-iteration-count: infinite;
		}
	}

	/* Duplicate message */
	.dupe-message {
		margin-top: auto;
		font-size: 0.8em;
	}
	.dupe-message + input {
		margin-top: 0.1em;
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

	/* Color animation */
	@keyframes colorFade {
		0%   { border-color: var(--border-color); }
		50%  { border-color: #AD301B; }
		100% { border-color: var(--border-color); }
	}
</style>
