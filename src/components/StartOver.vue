<script setup>
	import { ref } from 'vue';

	import { useRouter } from 'vue-router';
	import { useBingo } from '../composables/bingo.js';

	import UIModal from '../components/UIModal.vue';

	const router = useRouter();
	const { clearBingoCard } = useBingo();

	const modalActive = ref();

	function doRestart() {
		clearBingoCard(); // Overwrite bingo card in memory so navigation guard doesn't kick us out
		localStorage.clear(); // Clear all local data
		router.push('/list').then(() => { // Update URL and reload, clearing all memory
			location.reload();
		});
	}
</script>

<template>
	<button
		class="btn"
		title="Delete all data and start again"
		@click="modalActive = true"
	>
		🗑&#xFE0E; Reset
	</button>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			title="Confirm Restart"
			:show-close="false"
			class="modal"
			@close="modalActive = false"
		>
			<p>Are you sure you want to delete all local data and start again?  This cannot be undone.</p>
			<div class="buttons">
				<button @click="modalActive = false">Cancel</button>
				<button
					autofocus
					@click="doRestart"
				>
					Restart
				</button>
			</div>
		</UIModal>
	</teleport>
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

	.modal {
		padding: 0.2em 1.5em;

		.buttons {
			display: flex;
			justify-content: end;
			margin-right: 2px;
			gap: 1.5em;
			margin-top: 2em;
		}
	}
</style>
