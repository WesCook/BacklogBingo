import { reactive, readonly } from 'vue';

const cardSource = reactive({}); // Holds the original JSON data
const bingoCard = reactive({}); // Holds a filtered list with selected categories

export function useCategories() {
	function getCardSource() {
		return readonly(cardSource);
	}

	function getBingoCard() {
		return readonly(bingoCard);
	}

	// Set categories
	function setCardSource(categoriesObj) {
		Object.entries(categoriesObj).forEach(([key, value]) => {
			cardSource[key] = value; // Mutate values to avoid losing reactivity
		});
	}

	return {
		getCardSource,
		setCardSource,
		getBingoCard
	};
}
