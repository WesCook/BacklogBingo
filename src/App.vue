<script setup>
	import { useErrors } from './composables/errors.js';

	import ErrorPanel from './components/ErrorPanel.vue';

	const error = useErrors().getError();
</script>

<template>
	<RouterView />
	<ErrorPanel v-if="error" />
</template>
