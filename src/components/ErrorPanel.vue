<script setup>
	import { useErrors } from '../composables/errors.js';

	import IconClose from '../components/icons/IconClose.vue';

	const { getError, clearError } = useErrors();
	const error = getError();

	function close() {
		clearError();
	}
</script>

<template>
	<section class="error-panel">
		<button
			class="close"
			@click="close"
		>
			<IconClose style="--foreground-color: black;" />
		</button>
		<p>An error was found with the following message:</p>
		<p class="error-message">
			{{ error }}
		</p>
	</section>
</template>

<style scoped>
	.error-panel {
		margin-top: 2em;
		padding: 0.5em 1em;
		border: 1px solid #b00020;
		border-radius: 6px;
		font-size: 1.1em;
		color: #b00020;
		background: #ffeaea;
	}

	.error-panel p {
		margin: 8px;
	}

	.error-message {
		font-family: monospace;
		white-space: pre-line;
		margin-top: 0.5em;
		margin-left: 2em;
	}

	.close {
		all: unset;
		float: right;
		padding: 8px;
	}
</style>
