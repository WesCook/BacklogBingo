<script setup>
	import { ref } from 'vue';

	import { useCategories } from '../composables/categories.js';
	import { generateHSL } from '../utils/color-utils.js';

	import CategoriesGroup from '../components/CategoriesGroup.vue';
	import CategoriesItem from '../components/CategoriesItem.vue';
	import StartOver from '../components/StartOver.vue';

	const { setBingoCard, getCardSource, getCardSourceGroups } = useCategories();

	const cardSource = getCardSource();
	const groups = getCardSourceGroups();

	// Initialize with all entries so they are checked by default
	const groupValues = ref([...groups]);
	const categoryValues = ref([...cardSource.categories.map(category => category.name)]);

	const minCategories = ref(0); // TODO: Implement
	const currentCount = ref(0); // TODO: Implement

	function groupChange(group, checked) {
		// Get all categories for group
		const groupsCategories = cardSource.categories.filter(category => category.group === group).map(category => category.name);

		if (checked) {
			// Add categories that aren't already in the array
			categoryValues.value.push(...groupsCategories.filter(category => !categoryValues.value.includes(category)));
		} else {
			// Remove categories
			groupsCategories.forEach(category => {
				const index = categoryValues.value.indexOf(category);
				categoryValues.value.splice(index, 1);
			});
		}
	}

	function categoryChange(elem, checked) {
		// console.log(elem, checked);
	}

	// Generate colors to be assigned in template
	const colors = generateHSL(groups.length, 50, 50);
	const groupColors = {};
	groups.forEach((group, index) => {
		groupColors[group] = colors[index];
	});

	// Generate friendlier title case group names
	function pascalToTitleCase(input) {
		const result = input.replace(/([A-Z])/g, ' $1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}
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

	<!-- Group Toggles -->
	<div
		v-if="groups.length"
		class="groups-toggle"
	>
		<strong>Quick Toggle</strong>
		<ul class="groups-list">
			<CategoriesGroup
				v-for="group in groups"
				:key="group"
				v-model="groupValues"
				:name="group"
				:friendly-name="pascalToTitleCase(group)"
				:color="groupColors[group]"
				@group-change="groupChange"
			/>
		</ul>
	</div>

	<!-- Category List -->
	<ul class="categories-list">
		<CategoriesItem
			v-for="category in cardSource.categories"
			:key="category.name"
			v-model="categoryValues"
			:name="category.name"
			:color="groupColors[category.group]"
			@category-change="categoryChange"
		/>
	</ul>

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

	.groups-toggle {
		display: flex;
		gap: 1em;
	}
	.groups-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		column-gap: 1em;
	}

	.categories-list {
		margin: 1em 0 2em 0;
		min-height: 200px;
		list-style: none;
		padding: 15px;
		border: 1px solid var(--border-color);
		background-color: color-mix(in srgb, var(--background-shaded) 92%, var(--foreground-color));
	}
	@media (min-width: 700px) {
		.categories-list {
			columns: 2;
			column-gap: 24px;
		}
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
