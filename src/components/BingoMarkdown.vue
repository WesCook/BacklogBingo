<script setup>
	import { ref } from 'vue';

	const markdown = defineModel({ type: String });
	const status = ref();

	function copy() {
		// Play Copied! animation and pause at end of animation
		status.value.style.animationPlayState = 'running';
		status.value.addEventListener('animationiteration', () => {
			status.value.style.animationPlayState = 'paused';
		});

		// Copy to clipboard
		navigator.clipboard.writeText(markdown.value);
	}
</script>

<template>
	<textarea
		v-model="markdown"
		class="textarea"
	>Hello!</textarea>
	<button
		class="copy-btn"
		@click="copy"
	>
		📋&#xFE0E; &nbsp;Copy Table
	</button>
	<span
		ref="status"
		class="status"
	>Copied!</span>
</template>

<style scoped>
	.textarea {
		display: block;
		width: 100%;
		min-width: 100%;
		max-width: 100%;
		height: 120px;
		min-height: 100px;
		max-height: 600px;
		margin: 25px 0 10px 0;
		padding: 10px;
		font-family: monospace;
	}
	.copy-btn {
		all: unset;
		padding: 5px;
		font-variant-emoji: normal;
	}

	.status {
		margin-left: 10px;
		animation-name: fadeOut;
		animation-duration: 3.5s;
		animation-timing-function: linear;
		animation-iteration-count: infinite; /* We catch it with an event instead */
		animation-play-state: paused;
		visibility: hidden;
		opacity: 0;
	}
	@keyframes fadeOut {
		0% {
			visibility: hidden;
			opacity: 0;
		}
		15% {
			visibility: visible;
			opacity: 1;
		}
		70% {
			visibility: visible;
			opacity: 1;
		}
		100% {
			visibility: hidden;
			opacity: 0;
		}
	}
</style>
