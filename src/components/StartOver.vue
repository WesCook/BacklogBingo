<script setup>
	import { useRouter } from 'vue-router';

	const router = useRouter();

	function confirmRestart() {
		if (confirm('Are you sure you want to delete all local data and start again?  This cannot be undone.')) {
			localStorage.clear();
			router.push('/').then(() => {
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
		font-variant-emoji: normal;
	}
	.btn:hover {
		background-color: color-mix(in srgb, var(--background-shaded) 60%, #5f0000);
	}
</style>
