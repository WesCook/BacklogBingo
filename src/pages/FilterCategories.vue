<script setup>
	import { ref } from 'vue';

	import { useCategories } from '../composables/categories.js';

	import CategoriesList from '../components/CategoriesList.vue';
	import StartOver from '../components/StartOver.vue';

	const { setBingoCard } = useCategories();

	const minCategories = ref(0);
	const currentCount = ref(0);
</script>

<template>
	<div class="top-row">
		<h1>Categories</h1>
		<RouterLink to="/gamerules"><button>← Go back</button></RouterLink>
		<StartOver />
	</div>

	<p>Now select the categories you wish to populate your bingo card with.  These will be chosen at random from the list below.  Please uncheck any that you don't believe are possible for you to complete.</p>
	<p>You need to select at least <span>{{ minCategories }}</span> categories for a full Bingo card.</p>

	<CategoriesList />

	<p>These categories cannot be changed once your card is generated.</p>
	<p>Your card will be saved locally, and no data is stored online.  Please do not delete browser data to avoid data loss.</p>

	<!-- Just for testing purposes -->
	<button @click="setBingoCard">Generate Card</button>

	<span class="required-tally"><span>{{ currentCount }}</span> of <span>{{ minCategories }}</span> required</span>
</template>

<style scoped>
	.top-row {
		display: flex;
		align-items: start;
		gap: 10px;
		justify-content: end;

		h1 {
			margin-right: auto;
		}
	}

	.required-tally {
		align-self: center;
		margin-left: 10px;
		font-size: 0.8em;
		color: grey;
	}
</style>
