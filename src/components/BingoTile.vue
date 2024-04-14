<script setup>
	const props = defineProps({
		data: {
			type: Object,
			required: true
		},
		valid: {
			type: Boolean,
			required: false
		}
	});

	const emit = defineEmits(['edit-game']);

	function submitGameChange(event) {
		emit('edit-game', props.data.uuid, event.target.value);
	}
</script>

<template>
	<label
		class="bingo-tile"
		:class="{ valid: valid }"
	>
		<span>{{ data.name }}</span>
		<input
			@blur="submitGameChange"
			@keyup.enter="submitGameChange"
			@focus="$event.target.select()"
		>
	</label>
</template>

<style scoped>
	.bingo-tile {
		display: flex;
		gap: 5px;
		flex-direction: column;
		border: 1px solid var(--border-color);
		border-radius: 10px;
		padding: clamp(0.2em, 1vw, 0.5em);
		font-size: clamp(0.8em, calc(1vw + 0.3em), 0.95em);
		text-align: center;
		background-color: var(--invalid-card);
	}
	.bingo-tile:focus-within {
		border-color: color-mix(in srgb, var(--foreground-color) 90%, var(--background-color));
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

	.valid {
		background-color: var(--valid-card);
	}

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
