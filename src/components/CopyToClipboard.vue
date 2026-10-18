<script setup>
	import { ref } from 'vue';

	import IconClipboard from '../components/icons/IconClipboard.vue';
	import { useErrors } from '../composables/errors.js';

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

	const { setError } = useErrors();
	const status = ref(); // Template ref

	async function copy() {
		try {
			// Play Copied! CSS animation
			await navigator.clipboard.writeText(props.text);
			const animation = status.value.getAnimations()[0];
			if (animation) {
				animation.currentTime = 0;
				animation.play();
			}
		} catch {
			setError('Could not copy to the clipboard.  Please copy the text manually.');
		}
	}
</script>

<template>
	<div
		class="wrapper"
		:data-align="props.alignment"
	>
		<button
			class="copy-btn"
			@click="copy"
		>
			<IconClipboard /> Copy
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
	.wrapper[data-align="right"] {
		flex-direction: row-reverse;
	}

	.copy-btn {
		all: unset;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 5px;
	}

	.status {
		display: flex;
		justify-content: center;
		align-items: center;
		animation-name: fadeOut;
		animation-duration: 3.5s;
		animation-timing-function: linear;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
		animation-play-state: paused;
	}

	@media (width < 600px) {
		.wrapper {
			flex-direction: column !important;
		}
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
