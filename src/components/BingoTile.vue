<script setup>
	const props = defineProps({
		data: {
			type: Object,
			required: true
		}
	});
</script>

<template>
	<div class="bingo-tile">
		<span>{{ data.name }}</span>
	</div>
</template>

<style scoped>
	.bingo-tile {
		border: 1px solid var(--foreground-color);
		padding: clamp(0.2em, 1vw, 0.5em);
		font-size: clamp(0.8em, calc(1vw + 0.3em), 0.95em);
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
</style>
