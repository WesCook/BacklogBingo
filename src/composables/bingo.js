import { reactive, computed, readonly } from 'vue';

// Holds the categories and associated data for the generated bingo card
const bingoCard = reactive({});

function saveToBrowser() {
	localStorage.setItem('bingoCard', JSON.stringify(bingoCard));
}

export function useBingo() {
	// Returns true if bingo card has been configured
	const isBingoCardSet = computed(() => Object.keys(bingoCard).length !== 0);

	// Load data from browser and update local state
	// Mutate values to avoid losing reactivity
	function initializeData() {
		const bingoCardTemp = JSON.parse(localStorage.getItem('bingoCard'));
		if (bingoCardTemp) {
			Object.entries(bingoCardTemp).forEach(([key, value]) => {
				bingoCard[key] = value;
			});
		}
	}

	function getBingoCard() {
		return readonly(bingoCard);
	}

	// Overwrite entire card with new data
	function setBingoCard(bingoCardTemp) {
		Object.entries(bingoCardTemp).forEach(([key, value]) => {
			bingoCard[key] = value;
		});
		saveToBrowser();
	}

	// Save the entry name entered in that tile's text box
	function updateEntry(uuid, entry) {
		const index = bingoCard.categories.findIndex(cat => cat.uuid === uuid);
		bingoCard.categories[index].entry = entry;
		saveToBrowser();
	}

	function clearBingoCard() {
		delete bingoCard.name;
		delete bingoCard.win;
		delete bingoCard.categories;
	}

	// Current win state of the bingo card
	function setWinning(state) {
		bingoCard.win = state;
	}

	return {
		isBingoCardSet,
		initializeData,
		getBingoCard,
		setBingoCard,
		updateEntry,
		clearBingoCard,
		setWinning
	};
}
