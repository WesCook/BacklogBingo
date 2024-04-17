<script setup>
	import { useRouter } from 'vue-router';

	import { useBingo } from '../composables/bingo.js';

	const router = useRouter();
	const { clearBingoCard } = useBingo();

	function confirmRestart() {
		if (confirm('Are you sure you want to delete all local data and start again?  This cannot be undone.')) {
			clearBingoCard(); // Overwrite bingo card in memory so navigation guard doesn't kick us out
			localStorage.clear(); // Clear all local data
			router.push('/card').then(() => { // Update URL and reload, clearing all memory
				location.reload();
			});
		}
	}
</script>

<template>
	<button
		class="btn"
		title="Delete all data and start again"
		@click="confirmRestart"
	>
		🗑&#xFE0E; Reset
	</button>
</template>

<style scoped>
	.btn {
		border-color: #5f0000;
		background-color: color-mix(in srgb, var(--background-shaded) 80%, #5f0000);
		font-variant-emoji: text;
	}
	.btn:hover {
		background-color: color-mix(in srgb, var(--background-shaded) 60%, #5f0000);
	}
</style>
