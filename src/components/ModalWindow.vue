<script setup>
	import { ref, onMounted } from 'vue';

	const emit = defineEmits(['close']);
	const props = defineProps({
		title: {
			type: String,
			default: ''
		},
		showClose: {
			type: Boolean,
			default: false
		}
	});

	const modal = ref(null); // Template ref

	onMounted(() => {
		// Dialogs don't render their backdrops unless opened via showModal(),
		// so we do that rather than setting [open] manually in the template.
		modal.value.showModal();

		/*
		Detect clicks outside of dialog and close
		It's not possible to differenciate between the dialog and the ::backdrop pseudo-element,
		so for this to work consistently we remove padding on the dialog and compare click targets.
		If the inner div is the immediate target, then the backdrop was not clicked.
		*/
		modal.value.addEventListener('mousedown', event => {
			if (event.target === event.currentTarget) {
				emit('close');
			}
		});

		// Hitting escape normally removes the [open] attr but leaves element.  This intercepts and closes properly.
		modal.value.addEventListener('close', () => {
			emit('close');
		});
	});

	function closeModal() {
		emit('close');
	}
</script>

<template>
	<dialog
		ref="modal"
		class="modal-dialog"
	>
		<div class="modal-wrapper">
			<h3
				v-if="title"
				class="modal-header"
			>
				{{ title }}
			</h3>
			<div class="modal-content">
				<slot></slot>
			</div>
			<button
				v-if="showClose"
				class="close-button"
				@click="closeModal"
			>
				Close
			</button>
		</div>
	</dialog>
</template>

<style scoped>
	.modal-dialog {
		padding: 0; /* Clicks on <dialog> close it, so ensure all clicks are on children instead */
		border: none;
		box-shadow: var(--dropshadow) 0px 3px 8px;
		border-radius: 15px;
	}
	.modal-dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
	.modal-dialog:focus {
		outline: none;
	}

	.modal-wrapper {
		display: flex;
		flex-direction: column;
		width: min(75vw, 600px);
	}

	.modal-content {
		max-height: 50vh;
		overflow-y: auto;
		padding-bottom: 1.5em;
	}

	.modal-header {
		text-align: center;
		margin: 1em;
	}

	.close-button:focus {
		outline: none;
	}
</style>
