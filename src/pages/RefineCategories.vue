<script setup>
	import { ref } from 'vue';

	import { useCategories } from '../composables/categories.js';
	import { generateHSL } from '../utils/color-utils.js';

	import CategoriesList from '../components/CategoriesList.vue';
	import CategoriesGroupToggle from '../components/CategoriesGroupToggle.vue';
	import StartOver from '../components/StartOver.vue';

	const { setBingoCard, getCardSourceGroups } = useCategories();

	const categoryValues = ref([]);
	const groupValues = ref([]);

	const minCategories = ref(0);
	const currentCount = ref(0);

	// Generate colors to be assigned in template
	const groups = getCardSourceGroups();
	const colors = generateHSL(groups.length, 50, 50);
	const groupColors = {};
	groups.forEach((group, index) => {
		groupColors[group] = colors[index];
	});
</script>

<template>
	<div class="nav-bar">
		<h1>Refine Categories</h1>
		<RouterLink to="/gamerules"><button>← Go Back</button></RouterLink>
		<StartOver />
	</div>

	<p>Now you can fine-tune the categories your bingo card will pick from.  Please uncheck any categories that you don't believe are possible for you to complete.</p>
	<p>When you're ready, click <em>Generate Card</em> to create a unique bingo card from the selected categories, or click <em>Skip</em> to include all categories.</p>

	<div class="btn-bar">
		<button class="skip-btn">Skip this step</button>
		<span class="required-tally"><span>{{ currentCount }}</span> of <span>{{ minCategories }}</span> required</span>
		<button @click="setBingoCard">Generate Card</button>
	</div>

	<CategoriesGroupToggle
		v-model="groupValues"
		:colors="groupColors"
	/>

	<CategoriesList
		v-model="categoryValues"
		class="categories-list"
		:colors="groupColors"
	/>

	<p>Your card will be saved locally, and no information is stored online.  To avoid data loss, please do not delete your browser data.</p>
	<p>You need to select at least <span>{{ minCategories }}</span> categories for a full Bingo card.</p>

	<div class="btn-bar">
		<button class="skip-btn">Skip this step</button>
		<span class="required-tally"><span>{{ currentCount }}</span> of <span>{{ minCategories }}</span> required</span>
		<button @click="setBingoCard">Generate Card</button>
	</div>
</template>

<style scoped>
	.nav-bar {
		display: flex;
		align-items: start;
		gap: 10px;
		justify-content: end;

		h1 {
			margin-right: auto;
		}
	}

	.btn-bar {
		display: flex;
		justify-content: end;
		gap: 10px;
		margin: 1.5em 0;
	}

	.categories-list {
		margin: 1em 0 2em 0;
	}

	.skip-btn {
		margin-right: auto;
	}

	.required-tally {
		align-self: center;
		font-size: 0.8em;
		color: grey;
	}
</style>
