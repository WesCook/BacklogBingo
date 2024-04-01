<script setup>
	import { useGameRules } from './composables/gamerules.js';

	useGameRules().initializeData();
</script>

<template>
	<RouterView />
</template>
