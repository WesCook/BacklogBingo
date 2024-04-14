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

	function setBingoCard(bingoCardTemp) {
		Object.entries(bingoCardTemp).forEach(([key, value]) => {
			bingoCard[key] = value;
		});
		saveToBrowser();
	}

	function setGame(uuid, game) {
		const index = bingoCard.categories.findIndex(cat => cat.uuid === uuid);
		bingoCard.categories[index].game = game;
		saveToBrowser();
	}

	return {
		isBingoCardSet,
		initializeData,
		getBingoCard,
		setBingoCard,
		setGame
	};
}
