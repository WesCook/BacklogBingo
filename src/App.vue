<script setup>
	import { useGameRules } from './composables/gamerules.js';
	import { useCategories } from './composables/categories.js';
	import { useBingo } from './composables/bingo.js';
	import { useErrors } from './composables/errors.js';

	import ErrorPanel from './components/ErrorPanel.vue';

	// Load data from local storage if it exists
	useGameRules().initializeData();
	useCategories().initializeData();
	useBingo().initializeData();

	const error = useErrors().getError();
</script>

<template>
	<RouterView />
	<ErrorPanel v-if="error" />
</template>
