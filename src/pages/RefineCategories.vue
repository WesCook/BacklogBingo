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
	import IconLeftArrow from '../components/icons/IconLeftArrow.vue';

	const router = useRouter();
	const { getGameRules } = useGameRules();
	const { getCategoryList, getCategoryNumber } = useCategories();
	const { setRevealAnimation } = useBingo();

	const gamerules = getGameRules();
	const categoryList = getCategoryList();

	///////////////////////
	// Categories/Groups //
	///////////////////////

	// Holds all category data and state, with 'checked' property being v-modelled to page checkboxes
	const categories = ref(categoryList.categories.map(cat => ({
		...cat,
		uuid: crypto.randomUUID(),
		checked: true // All categories checked by default
	})));

	// Computed array of group names from categories
	// eg. ["Characters", "Series", ...]
	const groups = computed(() => {
		const groupSet = new Set(); // Set only allows unique items, so no risk of dupes
		categories.value.forEach(cat => {
			if (cat.group) {
				groupSet.add(cat.group);
			}
		});
		return [...groupSet];
	});

	// Computed array of all group states (checked/indeterminate) based on category checkboxes
	// eg. [{ name: "characters", checked: false, indeterminate: true }, ...]
	const groupStates = computed(() => {
		return groups.value.map(groupName => {
			const groupCategories = categories.value.filter(cat => cat.group === groupName); // Find all categories in this group
			const total = groupCategories.length;
			const checked = groupCategories.filter(cat => cat.checked).length;

			return {
				name: groupName,
				checked: checked === total, // True if ALL categories in this group are checked
				indeterminate: checked > 0 && checked < total // True if SOME categories in this group are checked
			};
		});
	});

	///////////////////
	// Template Info //
	///////////////////

	// Track checked categories to meet minimum
	const minCategories = ref(getCategoryNumber(gamerules.gridSize));
	const currentCount = computed(() => categories.value.filter(cat => cat.checked).length);
	const buttonsDisabled = computed(() => currentCount.value < minCategories.value);

	// Returns array of CSS colors to be assigned in template
	// eg. ["light-dark(hsl(72, 70%, 40%), hsl(72, 60%, 70%))", ...]
	const groupColors = generateColors();
	function generateColors() {
		const groupCount = groups.value.length;
		if (!groupCount) return [];
		return getThemedColors(groupCount);
	}

	///////////////////////////
	// Checkbox Click Events //
	///////////////////////////

	// Event from RefineCategoriesGroup when group checkbox changes
	function groupChangeEvent(groupName, checked) {
		categories.value
			.filter(cat => cat.group === groupName)
			.forEach(cat => cat.checked = checked);
	}

	function selectAll() {
		categories.value.forEach(cat => cat.checked = true);
	}

	function selectNone() {
		categories.value.forEach(cat => cat.checked = false);
	}

	///////////////////
	// Generate Card //
	///////////////////

	function generateCard() {
		// Transform checked categories for bingo card generation
		const checkedCategories = categories.value
			.filter(cat => cat.checked)
			.map(cat => ({
				uuid: cat.uuid,
				cat: cat.name,
				group: cat.group,
				dynamic: cat.dynamic
			}));

		const success = generateBingoCard(categoryList.name, checkedCategories);
		if (success) {
			console.log('Bingo card generated!');
			setRevealAnimation(true);
			router.push('/bingo');
		} else {
			console.error('Could not generate bingo card');
		}
	}
</script>

<template>
	<nav class="nav-bar">
		<h1>Refine Categories</h1>
		<StartOver />
		<RouterLink
			to="/settings"
			class="btn"
		>
			<IconLeftArrow /> Go Back
		</RouterLink>
	</nav>

	<p>Finally, you may omit any categories that aren't possible for you.</p>

	<!-- Group Toggles -->
	<div class="groups-toggle">
		<strong>Quick Toggle</strong>
		<ul
			v-if="groups.length"
			class="groups-list"
		>
			<RefineCategoriesGroup
				v-for="(groupName, index) of groups"
				:key="index"
				v-model="groupStates.find(state => state.name === groupName).checked"
				:group-name="groupName"
				:indeterminate="groupStates.find(state => state.name === groupName).indeterminate"
				:color="groupColors[index]"
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
			v-for="category of categories"
			:key="category.uuid"
			v-model="category.checked"
			:category="category"
			:color="groupColors[groups.indexOf(category.group)]"
		/>
	</ul>

	<p>When you're ready, click <em>Generate Card</em> to create a unique bingo card from the selected categories.</p>
	<p>Your card is kept on this device only.  Clearing your browser's saved data may delete it.</p>

	<!-- Navigation Buttons -->
	<nav class="nav-bar">
		<span class="required-tally"><span>{{ currentCount }}</span> of <span>{{ minCategories }}</span> required</span>
		<button
			:disabled="buttonsDisabled"
			@click="generateCard()"
		>
			Generate Card
		</button>
	</nav>
</template>

<style scoped>
	.groups-toggle {
		display: flex;
		gap: 1em;
		margin-top: 2em;
	}
	@media (width < 400px) {
		.groups-toggle {
			flex-direction: column;
		}
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
		margin: 0.5em 0 1.2em 0;
		min-height: 200px;
		list-style: none;
		padding: 15px;
		border: 1px solid var(--border-color);
		background-color: var(--background-section);

		.categories-list li {
			margin-bottom: 2px;
		}

		@media (min-width: 700px) {
			columns: 2;
			column-gap: 24px;
		}
	}

	.required-tally {
		font-size: 0.8em;
		color: color-mix(in srgb, var(--foreground-color) 61%, var(--background-color));
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
