<script setup>
	import { ref } from 'vue';

	import ModalWindow from '../components/ModalWindow.vue';

	const modalActive = ref();
</script>

<template>
	<button
		class="info-btn"
		@click="modalActive = true"
	>
		🛈
	</button>
	<teleport to="body">
		<ModalWindow
			v-if="modalActive"
			title="Markdown Information"
			:show-close="false"
			class="modal"
			@close="modalActive = false"
		>
			<p>A Markdown table is automatically generated for easy sharing of your bingo card progress.  This code will work on social media sites where Markdown is supported.</p>
			<button
				class="modal-btn"
				@click="modalActive = false"
			>
				Got it!
			</button>
		</ModalWindow>
	</teleport>
</template>

<style scoped>
	.modal {
		padding: 0.1em 1.5em;
	}

	.info-btn {
		all: unset;
		padding: 2px;
	}

	.modal-btn {
		float: right;
		margin-right: 2px;
	}
</style>
