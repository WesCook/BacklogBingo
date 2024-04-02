<script setup>
	import { ref } from 'vue';

	import CategoriesList from '../components/CategoriesList.vue';

	const minCategories = ref(0);
	const currentCount = ref(0);
</script>

<template>
	<h1>Categories</h1>

	<p>Now select the categories you wish to populate your bingo card with.  These will be chosen at random from the list below.  Please uncheck any that you don't believe are possible for you to complete.</p>
	<p>You need to select at least <span>{{ minCategories }}</span> categories for a full Bingo card.</p>

	<CategoriesList />

	<p>These categories cannot be changed once your card is generated.</p>
	<p>Your card will be saved locally, and no data is stored online.  Please do not delete browser data to avoid data loss.</p>

	<button>Generate Card</button>
	<span class="required-tally"><span>{{ currentCount }}</span> of <span>{{ minCategories }}</span> required</span>
</template>

<style scoped>
	.required-tally {
		color: grey;
		font-size: 0.8em;
		margin-left: 10px;
	}
</style>
