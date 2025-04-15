import { reactive, computed, readonly } from 'vue';

import { useErrors } from '../composables/errors.js';

const { setError } = useErrors();

// Holds JSON data from the category list
const categoryList = reactive({});

export function useCategories() {
	// Returns true if category list has been configured
	const isCategoryListSet = computed(() => Object.keys(categoryList).length !== 0);

	// Load data from browser and update local state
	// Mutate values to avoid losing reactivity
	function initializeData() {
		const categoryListStored = JSON.parse(localStorage.getItem('categoryList'));
		if (categoryListStored) {
			Object.assign(categoryList, categoryListStored);
		}
	}

	function getCategoryList() {
		return readonly(categoryList);
	}

	// Returns array of unique groups
	function getCategoryListGroups() {
		const groups = new Set(getCategoryList().categories.map(category => category.group));
		if (groups.has(undefined)) { // Empty values get caught as undefined so let's remove that
			groups.delete(undefined);
		}
		return Array.from(groups);
	}

	function getCategoryListCatNumber() {
		return categoryList.categories.length;
	}

	function setCategoryList(categoryListNew) {
		Object.keys(categoryList).forEach(key => delete categoryList[key]);
		Object.assign(categoryList, categoryListNew);
		localStorage.setItem('categoryList', JSON.stringify(categoryList));
	}

	// Calculate max grid size from category number, rounded down to nearest accepted size
	function getMaxGridSize(catNum) {
		const acceptedSizes = [3, 5, 7];
		const maxSize = Math.floor(Math.sqrt(catNum));
		for (let i=maxSize; i>=3; i--) {
			if (acceptedSizes.includes(i)) {
				return i; // 7, 5, 3
			}
		}

		setError('Grid size appears invalid.  Are there enough categories?');
		return -1;
	}

	// Get text label from numerical row size
	function getGridLabel(rowLength) {
		if (rowLength >= 7) {
			return 'large';
		} else if (rowLength >= 5) {
			return 'medium';
		} else if (rowLength >= 3) {
			return 'small';
		}

		setError('Grid size appears invalid.  Are there enough categories?');
		return 'unknown';
	}

	// Get category number from grid size
	function getCategoryNumber(label) {
		switch(label) {
			case 'large':
				return 49;
			case 'medium':
				return 25;
			case 'small':
				return 9;
			default: -1;
		}
	}

	// Get numerical row length from grid size
	function getRowLength(label) {
		switch(label) {
			case 'large':
				return 7;
			case 'medium':
				return 5;
			case 'small':
				return 3;
			default: -1;
		}
	}

	function shouldShrinkGrid() {
		if (categoryList.categories && getGridLabel(getMaxGridSize(getCategoryListCatNumber())) === 'small') {
			return true;
		}
		return false;
	}

	return {
		isCategoryListSet,
		initializeData,
		getCategoryList,
		getCategoryListGroups,
		getCategoryListCatNumber,
		setCategoryList,
		getMaxGridSize,
		getGridLabel,
		getCategoryNumber,
		getRowLength,
		shouldShrinkGrid
	};
}
