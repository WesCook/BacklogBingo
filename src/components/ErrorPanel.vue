<script setup>
	import { useErrors } from '../composables/errors.js';

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
			✖
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
		font-size: 1.1em;
		border: 1px solid orange;
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
