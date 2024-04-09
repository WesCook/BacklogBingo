<script setup>
	import { useBingo } from '../composables/bingo.js';

	import StartOver from '../components/StartOver.vue';

	const { getBingoCard } = useBingo();
</script>

<template>
	<h1>Bingo Card</h1>
	<p>Hooray, you've generated a bingo card!  This page isn't done yet, but you can click Reset below to start over.</p>
	<StartOver />
	
	<RouterLink to="/gamerules">
		<button>Edit Game Rules</button>
	</RouterLink>
	<pre>{{ getBingoCard() }}</pre>
</template>

<style scoped>
	pre {
		margin-top: 4em;
	}

	button + a {
		margin-left: 1em;
	}
</style>
