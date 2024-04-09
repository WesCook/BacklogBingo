<script setup>
	import { ref } from 'vue';

	import { useCategories } from '../composables/categories.js';
	import { getThemedColors } from '../utils/color-gen.js';

	import CategoriesGroup from '../components/CategoriesGroup.vue';
	import CategoriesItem from '../components/CategoriesItem.vue';
	import StartOver from '../components/StartOver.vue';

	const { getCardSource, setBingoCard } = useCategories();

	// Category, group, and color lookup
	const { categoryList, groupList } = populateCategoryAndGroups();
	const groupColors = generateColors();

	// Checkbox state: initialize with all entries so they are checked by default
	const groupValues = ref(getAllGroups());
	const categoryValues = ref(getAllCategories());

	// Track selected categories to meet minimum
	const minCategories = ref(0); // TODO: Implement
	const currentCount = ref(0); // TODO: Implement


	// Build new list of categories and groups for easier manipulation
	// Using UUIDs as keys.  Avoiding using raw values in template and v-for keys.
	function populateCategoryAndGroups() {
		const categoryList = new Map();
		const groupList = new Map();
		const groupMap = new Map(); // Reverse map of UUID to group name

		for (const categorySource of getCardSource().categories) {
			// Create new, mutable category object
			const category = {
				name: categorySource.name
			};

			// Generate group UUID if needed, then add to object and Groups List
			if (categorySource.group) {
				let groupID;
				if (groupMap.has(categorySource.group)) {
					groupID = groupMap.get(categorySource.group);
				} else {
					groupID = crypto.randomUUID();
					groupList.set(groupID, categorySource.group);
					groupMap.set(categorySource.group, groupID);
				}
				category.group = groupID;
			}

			// Add to Category List
			categoryList.set(crypto.randomUUID(), category);
		}

		return { categoryList, groupList };
	}

	// Generate colors to be assigned in template
	function generateColors() {
		const colors = getThemedColors(groupList.size);
		const groupColors = {};
		Array.from(groupList).forEach((groupArray, index) => {
			groupColors[groupArray[0]] = colors[index];
		});

		return groupColors;
	}

	function getAllGroups() {
		return [...groupList.keys()];
	}

	function getAllCategories() {
		return [...categoryList.keys()];
	}

	function selectAll() {
		groupValues.value = getAllGroups();
		categoryValues.value = getAllCategories();
	}

	function selectNone() {
		groupValues.value = [];
		categoryValues.value = [];
	}

	// Returns all category UUIDs for a given group UUID
	function getCategoriesFromGroup(group) {
		return Array.from(categoryList)
			.filter(([_catID, category]) => category.group === group)
			.map(([uuid, _cat]) => uuid);
	}

	// Accepts array of category IDs to check
	// Filter out those that are already included
	function checkCategories(categories) {
		categoryValues.value.push(...categories.filter(category => !categoryValues.value.includes(category)));
	}

	// Accepts array of category IDs to uncheck
	function uncheckCategories(categories) {
		categories.forEach(category => {
			const index = categoryValues.value.indexOf(category);
			if (index >= 0) {
				categoryValues.value.splice(index, 1);
			}
		});
	}

	// Get number of checked categories in a group
	function getGroupCheckedCount(group) {
		const groupsCategories = getCategoriesFromGroup(group);
		return groupsCategories.reduce((count, catID) => categoryValues.value.includes(catID) ? count + 1 : count, 0);
	}

	// Event from CategoriesGroup when group checkbox changes
	function groupChangeEvent(group, checked) {
		const groupsCategories = getCategoriesFromGroup(group);
		if (checked) {
			checkCategories(groupsCategories);
		} else {
			uncheckCategories(groupsCategories);
		}
	}

	// Event from CategoriesItem when category checkbox changes
	function categoryChangeEvent(category) {
		// Get group from category
		const group = categoryList.get(category).group;

		if (!group) {
			return;
		}

		// Get all categories for group and count checked states
		const groupsCategories = getCategoriesFromGroup(group);
		const checkCount = getGroupCheckedCount(group);

		// Update group checkbox based on state
		if (checkCount === groupsCategories.length) {
			// All cats checked
			if (!groupValues.value.includes(group)) {
				groupValues.value.push(group);
			}
		} else {
			// Not all cats checked, so group is also unchecked
			const index = groupValues.value.indexOf(group);
			if (index >= 0) {
				groupValues.value.splice(index, 1);
			}
		}
	}

	// When group checkboxes are neither full nor empty, they are indeterminate
	function getIndeterminate(group) {
		const groupsCategories = getCategoriesFromGroup(group);
		const checkCount = getGroupCheckedCount(group);
		return checkCount > 0 && checkCount < groupsCategories.length;
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
		v-if="groupList.size"
		class="groups-toggle"
	>
		<strong>Quick Toggle</strong>
		<ul class="groups-list">
			<CategoriesGroup
				v-for="[uuid, group] of groupList"
				:key="uuid"
				v-model="groupValues"
				:uuid="uuid"
				:friendly-name="group"
				:indeterminate="getIndeterminate(uuid)"
				:color="groupColors[uuid]"
				@group-change="groupChangeEvent"
			/>
		</ul>

		<!-- Select All/None -->
		<div class="selectAllNone">
			<button @click="selectAll">All</button>
			<span>/</span>
			<button @click="selectNone">None</button>
		</div>
	</div>

	<!-- Category List -->
	<ul class="categories-list">
		<CategoriesItem
			v-for="[uuid, category] of categoryList"
			:key="uuid"
			v-model="categoryValues"
			:uuid="uuid"
			:category-name="category.name"
			:color="groupColors[categoryList.get(uuid).group]"
			@category-change="categoryChangeEvent"
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
		margin-top: 2em;
	}

	.groups-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		column-gap: 1em;
	}

	.selectAllNone {
		margin-left: auto;
		white-space: nowrap;
		margin-top: -8px;
	}
	.selectAllNone button {
		all: unset;
		padding: 3px 5px;
		margin: 5px;
	}

	.categories-list {
		margin: 0.5em 0 2em 0;
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
