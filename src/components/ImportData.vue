<script setup>
	import { ref } from 'vue';

	import UIModal from '../components/UIModal.vue';
	import CategoryListFile from '../components/CategoryListFile.vue';
	import CategoryListURL from '../components/CategoryListURL.vue';
	import IconUpload from '../components/icons/IconUpload.vue';

	const modalActive = ref();

	// TODO: Move import logic here from CategoryList
</script>

<template>
	<button
		class="btn"
		title="Import bingo card or custom list"
		@click="modalActive = true"
	>
		<IconUpload /> Import
	</button>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			title="Import"
			:show-close="false"
			class="modal"
			@close="modalActive = false"
		>
			<IconUpload
				size="50px"
				class="modal-icon"
			/>

			<p>
				Import an existing bingo card, or generate a new card from a custom category list.
				<a
					href="https://github.com/WesCook/BacklogBingo/wiki/Category-List"
					target="_blank"
				>Learn more</a>.
			</p>

			<p>Select a file from your PC</p>
			<CategoryListFile @load-file="loadFile" />

			<p>Or download from an online URL</p>
			<CategoryListURL @load-file="loadFile" />

			<!-- TODO: Move preview pane here from CategoryList -->

			<div class="buttons">
				<button @click="modalActive = false">Cancel</button>
				<button>Import</button>
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
			gap: 1em;
			margin-top: 2em;
		}
	}
</style>
