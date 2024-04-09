import { reactive, computed, readonly, toRaw } from 'vue';

import { useCategories } from '../composables/categories.js';
import { useBingo } from '../composables/bingo.js';

const { getCardSourceCatNumber, getMaxGridSize, getGridLabel } = useCategories();
const { isBingoCardSet } = useBingo();

// Holds the current game rules
const gamerules = reactive({});

// Predefined game modes
const defaultGameModes = {
	'standard': {
		winCondition: 'row-col-diag',
		gridSize: 'medium',
		golf: false,
		lockRandom: false,
		allowSimilar: false,
		star: 'wildcard'
	},
	'golf': {
		winCondition: 'blackout',
		gridSize: 'medium',
		golf: true,
		lockRandom: false,
		allowSimilar: false,
		star: 'free'
	}
};

function saveToBrowser() {
	localStorage.setItem('gamerules', JSON.stringify(gamerules));
}

export function useGameRules() {
	// Returns true if gamerules have been configured
	const areGamerulesSet = computed(() => Object.keys(gamerules).length !== 0);

	// Load data from browser and update local state
	function initializeData() {
		const gamerulesTemp = JSON.parse(localStorage.getItem('gamerules'));
		if (gamerulesTemp) {
			Object.entries(gamerulesTemp).forEach(([key, value]) => {
				gamerules[key] = value; // Mutate values to avoid losing reactivity
			});
		}
	}

	// Return readonly version of gamerules
	function getGameRules() {
		return readonly(gamerules);
	}

	// Set specific game rule with value
	function setGameRule(rule, value) {
		gamerules[rule] = value;
		saveToBrowser();
	}

	// Reset game rules to preset
	function resetGameRules(gamemode) {
		if (!defaultGameModes[gamemode]) {
			console.error(`Game mode ${gamemode} not found.`);
			return;
		}

		const transform = gamerulesTransform(defaultGameModes[gamemode], ['locked', 'shrinkgrid']);
		for (const rule in transform) {
			gamerules[rule] = transform[rule];
		}
		saveToBrowser();
	}

	// Returns modified gamerules with requested transforms, as passed in an array
	// - ['locked'] If card has already been generated, some settings are locked and can't change away from current gamerules
	// - ['shrinkgrid'] If category limit is too low for default grid size, use small grid
	function gamerulesTransform(gamerulesTemp, transforms = []) {
		// Start with untransformed version (automatically unwrap proxies)
		const gamerulesTransform = structuredClone(toRaw(gamerulesTemp));

		if (transforms.includes('locked')) {
			// Retain locked settings because they shouldn't change after a card has been generated
			if (isBingoCardSet.value) {
				gamerulesTransform.gridSize = gamerules.gridSize;
				gamerulesTransform.allowSimilar = gamerules.allowSimilar;
			}
		}

		if (transforms.includes('shrinkgrid')) {
			// If we're forced to use a small grid, overwrite it to small instead
			const maxGridSize = getGridLabel(getMaxGridSize(getCardSourceCatNumber()));
			if (maxGridSize === 'small') {
				gamerulesTransform.gridSize = 'small';
			}
		}

		return gamerulesTransform;
	}

	// Find gamemode by comparing current gamerules against (transformed) defaults
	// Calculating instead of storing gamemode allows us to change the default later
	// without creating conflicts.
	function calculateGameMode() {
		// Returns true if objects match
		// Not using stringify for comparison because that's impacted by key order
		const compareObjects = (obj1, obj2) => {
			for (const key of Object.keys(obj1)) {
				if (obj1[key] !== obj2[key]) {
					return false;
				}
			}
			return true;
		};

		if (compareObjects(gamerules, gamerulesTransform(defaultGameModes['standard'], ['shrinkgrid']))) {
			return 'standard';
		} else if (compareObjects(gamerules, gamerulesTransform(defaultGameModes['golf'], ['shrinkgrid']))) {
			return 'golf';
		}
		return 'custom';
	}

	return {
		areGamerulesSet,
		initializeData,
		getGameRules,
		setGameRule,
		resetGameRules,
		gamerulesTransform,
		calculateGameMode
	};
}
