<script setup>
	import { ref } from 'vue';

	const props = defineProps({
		// The text to be copied
		text: {
			type: String,
			default: ''
		},
		// If the copy button is left or right aligned
		alignment: {
			type: String,
			default: 'left',
			validator: value => ['left', 'right'].includes(value)
		}
	});

	const status = ref(); // Template ref

	function copy() {
		// Play Copied! animation and pause at end of animation
		status.value.style.animationPlayState = 'running';
		status.value.addEventListener('animationiteration', () => {
			status.value.style.animationPlayState = 'paused';
		});

		// Copy to clipboard
		navigator.clipboard.writeText(props.text);
	}
</script>

<template>
	<div class="wrapper">
		<button
			class="copy-btn"
			:style="{ order: props.alignment === 'left' ? 0 : 1 }"
			@click="copy"
		>
			📋&#xFE0E; &nbsp;Copy
		</button>
		<span
			ref="status"
			class="status"
		>Copied!</span>
	</div>
</template>

<style scoped>
	.wrapper {
		display: inline-flex;
		gap: 10px;
	}

	.copy-btn {
		all: unset;
		padding: 5px;
		font-variant-emoji: text;
		white-space: nowrap;
	}

	.status {
		display: flex;
		align-items: center;
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
