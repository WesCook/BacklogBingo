<script setup>
	import { ref, toRaw } from 'vue';

	import { useBingo } from '../composables/bingo.js';
	import { useGameRules } from '../composables/gamerules.js';

	import UIModal from '../components/UIModal.vue';
	import IconDownload from '../components/icons/IconDownload.vue';
	import { exportToFile } from '../utils/file-export.js';

	const modalActive = ref();
	const exportSuccess = ref();
	const exportMessage = ref('');

	const { getBingoCard } = useBingo();
	const bingoCard = getBingoCard();

	const { getGameRules } = useGameRules();
	const gamerules = getGameRules();

	function exportBingoCard() {
		// Duplicate card data and add keys
		const card = structuredClone(toRaw(bingoCard));
		card.gamerules = gamerules;
		card.version = 1;
		card.exported = Date.now();

		// Export and update UI with result
		const { success, message } = exportToFile(card);
		exportSuccess.value = success;
		exportMessage.value = message;
	}
</script>

<template>
	<button
		class="btn"
		title="Export bingo card"
		@click="modalActive = true"
	>
		<IconDownload /> Export
	</button>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			title="Export Bingo Card"
			:show-close="false"
			class="modal"
			@close="modalActive = false"
		>
			<IconDownload
				size="50px"
				class="modal-icon"
			/>

			<p>Export your current bingo card to JSON.  This will be saved as a file, and may be imported from the starting Category List page using <em>From File</em> or <em>From URL</em>.</p>

			<div class="buttons">
				<button @click="modalActive = false">Cancel</button>
				<button
					autofocus
					@click="exportBingoCard"
				>
					Export
				</button>
			</div>

			<div
				v-if="exportMessage"
				:class="exportSuccess ? 'export-success' : 'export-error'"
			>
				{{ exportMessage }}
			</div>
		</UIModal>
	</teleport>
</template>

<style scoped>
	.modal {
		padding: 0.2em 1.5em;

		.modal-icon {
			margin: 0 auto 2em auto;
		}

		.buttons {
			display: flex;
			justify-content: end;
			margin-right: 2px;
			gap: 1.5em;
			margin-top: 2em;
		}
	}

	.export-success,
	.export-error {
		margin-top: 1.5em;
		padding: 0.5em 1em;
		border-radius: 6px;
		font-weight: bold;
		text-align: center;
	}
	.export-success {
		color: #008000;
		background: #eaffea;
		border: 1px solid #008000;
	}
	.export-error {
		color: #b00020;
		background: #ffeaea;
		border: 1px solid #b00020;
	}
</style>
