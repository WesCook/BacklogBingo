import { reactive, computed, readonly } from 'vue';

import { useErrors } from '../composables/errors.js';

const { setError } = useErrors();

const cardSource = reactive({}); // Holds the original JSON data
const bingoCard = reactive({}); // Holds a filtered list with selected categories

export function useCategories() {
	// Returns true if card source has been configured
	const isCardSourceSet = computed(() => Object.keys(cardSource).length !== 0);
	const isBingoCardSet = computed(() => Object.keys(bingoCard).length !== 0);

	// Load data from browser and update local state
	// Mutate values to avoid losing reactivity
	function initializeData() {
		const cardSourceTemp = JSON.parse(localStorage.getItem('cardSource'));
		if (cardSourceTemp) {
			Object.entries(cardSourceTemp).forEach(([key, value]) => {
				cardSource[key] = value;
			});
		}

		const bingoCardTemp = JSON.parse(localStorage.getItem('bingoCard'));
		if (bingoCardTemp) {
			Object.entries(bingoCardTemp).forEach(([key, value]) => {
				bingoCard[key] = value;
			});
		}
	}

	function getCardSource() {
		return readonly(cardSource);
	}

	function getBingoCard() {
		return readonly(bingoCard);
	}

	function getCardSourceCatNumber() {
		return cardSource.categories.length;
	}

	function setCardSource(categoriesObj) {
		Object.entries(categoriesObj).forEach(([key, value]) => {
			cardSource[key] = value; // Mutate values to avoid losing reactivity
		});
		localStorage.setItem('cardSource', JSON.stringify(cardSource));
	}

	// Update generated bingo card and save to browser
	// TODO: Fully implement.  Just using for testing purposes currently.
	function setBingoCard() {
		bingoCard.name = cardSource.name;
		bingoCard.version = cardSource.version;
		bingoCard.categories = cardSource.categories;
		// bingoCard.categories = cardSource.categories.filter(category => bingoCard[category]);
		localStorage.setItem('bingoCard', JSON.stringify(cardSource));
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

	return {
		isCardSourceSet,
		isBingoCardSet,
		initializeData,
		getCardSource,
		getCardSourceCatNumber,
		setCardSource,
		getBingoCard,
		setBingoCard,
		getMaxGridSize,
		getGridLabel
	};
}
