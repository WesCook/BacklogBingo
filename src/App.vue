<script setup>
	import { reactive, readonly, provide } from 'vue';

	// Providing readonly version to avoid accidental mutation - must be emitted upwards
	const gamerules = reactive({});
	provide('gamerules', readonly(gamerules));

	function updateGamerules(rule, value) {
		gamerules[rule] = value;
		console.log(rule, value);
	}

	// TODO: Load from localStorage instead of initializing here
	updateGamerules('winCondition', 'blackout');
	updateGamerules('gridSize', 'medium');
	updateGamerules('golf', true);
	updateGamerules('lockRandom', false);
	updateGamerules('allowSimilar', false);
	updateGamerules('star', 'free');
</script>

<template>
	<RouterView @gamerule-update="updateGamerules" />
</template>
