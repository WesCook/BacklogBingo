<script setup>
	// TODO: Load from localStorage instead of initializing here
	import { useGameRules } from './composables/gamerules.js';
	useGameRules().resetGameRules('standard');
</script>

<template>
	<RouterView />
</template>
