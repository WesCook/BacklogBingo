<script setup>
	import { useCategories } from './composables/categories.js';
	import { useGameRules } from './composables/gamerules.js';
	import { useErrors } from './composables/errors.js';

	import ErrorPanel from './components/ErrorPanel.vue';

	// Load data from local storage if it exists
	useCategories().initializeData();
	useGameRules().initializeData();

	const error = useErrors().getError();
</script>

<template>
	<RouterView />
	<ErrorPanel v-if="error" />
</template>
