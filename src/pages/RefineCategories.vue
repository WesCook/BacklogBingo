<script setup>
	import { ref, computed } from 'vue';
	import { useRouter } from 'vue-router';

	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';
	import { useBingo } from '../composables/bingo.js';
	import { getThemedColors } from '../utils/color-gen.js';
	import { generateBingoCard } from '../utils/bingo-card-gen.js';

	import RefineCategoriesGroup from '../components/RefineCategoriesGroup.vue';
	import RefineCategoriesItem from '../components/RefineCategoriesItem.vue';
	import StartOver from '../components/StartOver.vue';

	const router = useRouter();
	const { getGameRules } = useGameRules();
	const { getCategoryList, getCategoryNumber } = useCategories();
	const { setRevealAnimation } = useBingo();

	///////////////////
	// Initial State //
	///////////////////

	const gamerules = getGameRules();
	const categoryList = getCategoryList();
	const { categoryMap, groupMap } = populateCategoryAndGroups();

	// Group and category checkboxes - initialize with all values so they're checked by default
	const groupValues = ref(getAllGroups());
	const categoryValues = ref(getAllCategories());

	// Build new list of categories and groups for easier manipulation
	// Using UUIDs as keys.  Avoiding using raw values in template and v-for keys.
	function populateCategoryAndGroups() {
		const categoryMap = new Map();
		const groupMap = new Map();
		const groupUUIDMap = new Map(); // Reverse map of UUID to group name

		for (const catSource of categoryList.categories) {
			// Create new, mutable category object
			const category = {
				name: catSource.name,
				dynamic: catSource.dynamic
			};

			// Generate group UUID if needed, then add to object and Groups List
			if (catSource.group) {
				let groupID;
				if (groupUUIDMap.has(catSource.group)) {
					groupID = groupUUIDMap.get(catSource.group);
				} else {
					groupID = crypto.randomUUID();
					groupMap.set(groupID, catSource.group);
					groupUUIDMap.set(catSource.group, groupID);
				}
				category.group = groupID;
			}

			categoryMap.set(crypto.randomUUID(), category);
		}

		return { categoryMap, groupMap };
	}

	///////////////////////////
	// Checkbox Manipulation //
	///////////////////////////

	function getAllGroups() {
		return [...groupMap.keys()];
	}

	function getAllCategories() {
		return [...categoryMap.keys()];
	}

	function selectAll() {
		groupValues.value = getAllGroups();
		categoryValues.value = getAllCategories();
	}

	function selectNone() {
		groupValues.value = [];
		categoryValues.value = [];
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

	///////////////////////////////
	// Get State from Checkboxes //
	///////////////////////////////

	// Get number of checked categories in a group
	function getGroupCheckedCount(group) {
		const groupsCategories = getCategoriesFromGroup(group);
		return groupsCategories.reduce((count, catID) => categoryValues.value.includes(catID) ? count + 1 : count, 0);
	}

	// When group checkboxes are neither full nor empty, they are indeterminate
	function getIndeterminate(group) {
		const groupsCategories = getCategoriesFromGroup(group);
		const checkCount = getGroupCheckedCount(group);
		return checkCount > 0 && checkCount < groupsCategories.length;
	}

	// Returns all category UUIDs for a given group UUID
	function getCategoriesFromGroup(group) {
		return Array.from(categoryMap)
			.filter(([_catID, category]) => category.group === group)
			.map(([uuid, _cat]) => uuid);
	}

	///////////////////////////
	// Checkbox Click Events //
	///////////////////////////

	// Event from RefineCategoriesGroup when group checkbox changes
	function groupChangeEvent(group, checked) {
		const groupsCategories = getCategoriesFromGroup(group);
		if (checked) {
			checkCategories(groupsCategories);
		} else {
			uncheckCategories(groupsCategories);
		}
	}

	// Event from RefineCategoriesItem when category checkbox changes
	function categoryChangeEvent(category) {
		// Get group from category
		const group = categoryMap.get(category).group;

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

	///////////////////
	// Generate Card //
	///////////////////

	// Skip determines if filters are used, or if Skip button was clicked
	function generateCard(skip) {
		// Collect all or only checked categories, then flatten into accessible structure (arr of objs)
		let catSubset = [];

		if (skip) {
			catSubset = Array.from(categoryMap).map(([uuid, catObj]) => ({
				uuid,
				cat: catObj.name,
				group: catObj.group,
				dynamic: catObj.dynamic
			}));
		} else {
			catSubset = categoryValues.value.map(uuid => ({
				uuid,
				cat: categoryMap.get(uuid).name,
				group: categoryMap.get(uuid).group,
				dynamic: categoryMap.get(uuid).dynamic
			}));
		}

		const success = generateBingoCard(categoryList.name, catSubset);
		if (success) {
			console.log('Bingo card generated!');
			setRevealAnimation(true);
			router.push('/bingo');
		} else {
			console.error('Could not generate bingo card');
		}
	}

	///////////////////
	// Template Data //
	///////////////////

	// Track selected categories to meet minimum
	const minCategories = ref(getCategoryNumber(gamerules.gridSize));
	const currentCount = computed(() => categoryValues.value.length);
	const buttonsDisabled = computed(() => currentCount.value < minCategories.value);

	// Generate colors to be assigned in template
	const groupColors = generateColors();
	function generateColors() {
		const colors = getThemedColors(groupMap.size);
		const groupColors = {};
		Array.from(groupMap).forEach((groupArray, index) => {
			groupColors[groupArray[0]] = colors[index];
		});

		return groupColors;
	}
</script>

<template>
	<div class="nav-bar">
		<h1>Refine Categories</h1>
		<StartOver />
		<RouterLink
			to="/gamerules"
			class="button"
		>
			← Go Back
		</RouterLink>
	</div>

	<p>Now you can fine-tune the categories your bingo card will pick from.  Please uncheck any categories that you don't believe are possible for you to complete.</p>

	<!-- Group Toggles -->
	<div
		v-if="groupMap.size"
		class="groups-toggle"
	>
		<strong>Quick Toggle</strong>
		<ul class="groups-list">
			<RefineCategoriesGroup
				v-for="[uuid, group] of groupMap"
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
		<RefineCategoriesItem
			v-for="[uuid, category] of categoryMap"
			:key="uuid"
			v-model="categoryValues"
			:uuid="uuid"
			:category-name="category.name"
			:dynamic="category.dynamic"
			:color="groupColors[categoryMap.get(uuid).group]"
			@category-change="categoryChangeEvent"
		/>
	</ul>

	<p>When you're ready, click <em>Generate Card</em> to create a unique bingo card from the selected categories, or click <em>Skip</em> to include all categories.</p>
	<p>Your card will be saved locally, and no information is stored online.  To avoid data loss, <em>please do not delete your browser data</em>.</p>

	<!-- Navigation Buttons -->
	<div class="btn-bar">
		<button @click="generateCard(true)">Skip this step</button>
		<span class="required-tally"><span>{{ currentCount }}</span> of <span>{{ minCategories }}</span> required</span>
		<button
			:disabled="buttonsDisabled"
			@click="generateCard(false)"
		>
			Generate Card
		</button>
	</div>
</template>

<style scoped>
	.btn-bar {
		display: flex;
		justify-content: end;
		gap: 10px;
		margin: 1.5em 0;
	}
	.btn-bar button:first-child {
		margin-right: auto;
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
	.selectAllNone :where(button) { /* Reduce specificity */
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
		background-color: var(--background-section);
	}
	@media (min-width: 700px) {
		.categories-list {
			columns: 2;
			column-gap: 24px;
		}
	}
	.categories-list li {
		margin-bottom: 2px;
	}

	.required-tally {
		align-self: center;
		font-size: 0.8em;
		color: color-mix(in srgb, var(--foreground-color) 61%, var(--background-color));
	}
</style>
