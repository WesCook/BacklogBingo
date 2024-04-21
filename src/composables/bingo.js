import { ref, reactive, computed, readonly } from 'vue';

// Holds the categories and associated data for the generated bingo card
const bingoCard = reactive({});

// When first generating bingo card, play a reveal animation
// Setting this to true will enable the animation every page load
const doBingoAnimation = ref(false);

function saveToBrowser() {
	localStorage.setItem('bingoCard', JSON.stringify(bingoCard));
}

export function useBingo() {
	// Returns true if bingo card has been configured
	const isBingoCardSet = computed(() => Object.keys(bingoCard).length !== 0);

	// Load data from browser and update local state
	// Mutate values to avoid losing reactivity
	function initializeData() {
		const bingoCardStored = JSON.parse(localStorage.getItem('bingoCard'));
		if (bingoCardStored) {
			Object.assign(bingoCard, bingoCardStored);
		}
	}

	function getBingoCard() {
		return readonly(bingoCard);
	}

	// Overwrite entire card with new data
	function setBingoCard(bingoCardNew) {
		Object.assign(bingoCard, bingoCardNew);
		saveToBrowser();
	}

	// Save the entry name entered in that tile's text box
	function updateEntry(uuid, entry) {
		const index = bingoCard.categories.findIndex(cat => cat.uuid === uuid);
		bingoCard.categories[index].entry = entry;
		saveToBrowser();
	}

	function getStarTile() {
		const starIndex = Math.floor(bingoCard.categories.length / 2);
		return bingoCard.categories[starIndex].uuid;
	}

	function clearBingoCard() {
		delete bingoCard.name;
		delete bingoCard.win;
		delete bingoCard.categories;
	}

	function setRevealAnimation(state) {
		doBingoAnimation.value = state;
	}

	function getRevealAnimation() {
		return doBingoAnimation;
	}

	return {
		isBingoCardSet,
		initializeData,
		getBingoCard,
		setBingoCard,
		updateEntry,
		getStarTile,
		clearBingoCard,
		setRevealAnimation,
		getRevealAnimation
	};
}
