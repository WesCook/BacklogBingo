import { reactive, computed, readonly } from 'vue';

import { useErrors } from '../composables/errors.js';

const { setError } = useErrors();

// Holds JSON data from the card source
const cardSource = reactive({});

export function useCategories() {
	// Returns true if card source has been configured
	const isCardSourceSet = computed(() => Object.keys(cardSource).length !== 0);

	// Load data from browser and update local state
	// Mutate values to avoid losing reactivity
	function initializeData() {
		const cardSourceStored = JSON.parse(localStorage.getItem('cardSource'));
		if (cardSourceStored) {
			Object.assign(cardSource, cardSourceStored);
		}
	}

	function getCardSource() {
		return readonly(cardSource);
	}

	// Returns array of unique groups
	function getCardSourceGroups() {
		const groups = new Set(getCardSource().categories.map(category => category.group));
		if (groups.has(undefined)) { // Empty values get caught as undefined so let's remove that
			groups.delete(undefined);
		}
		return Array.from(groups);
	}

	function getCardSourceCatNumber() {
		return cardSource.categories.length;
	}

	function setCardSource(cardSourceNew) {
		Object.assign(cardSource, cardSourceNew);
		localStorage.setItem('cardSource', JSON.stringify(cardSource));
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
		if (cardSource.categories && getGridLabel(getMaxGridSize(getCardSourceCatNumber())) === 'small') {
			return true;
		}
		return false;
	}

	return {
		isCardSourceSet,
		initializeData,
		getCardSource,
		getCardSourceGroups,
		getCardSourceCatNumber,
		setCardSource,
		getMaxGridSize,
		getGridLabel,
		getCategoryNumber,
		getRowLength,
		shouldShrinkGrid
	};
}
