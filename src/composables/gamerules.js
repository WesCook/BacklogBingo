import { reactive, computed, readonly, toRaw } from 'vue';

import { objectsAreEqual } from '../utils/object-utils.js';

// Holds the current game rules
const gamerules = reactive({});

// Predefined game modes
const defaultGameModes = {
	'standard': {
		winCondition: 'row-col-diag',
		star: 'wildcard',
		allowDuplicates: false,
		gridSize: 'medium',
		allowSimilar: false,
		seed: ''
	},
	'golf': {
		winCondition: 'blackout',
		star: 'free',
		allowDuplicates: true,
		gridSize: 'medium',
		allowSimilar: false,
		seed: ''
	}
};

function saveToBrowser() {
	localStorage.setItem('gamerules', JSON.stringify(gamerules));
}

// Returns gamerules passed in with transform applied.  Will lock some settings based on current gamerules state.
function transformLocked(gamerulesTemp) {
	// Start with untransformed version (automatically unwrap proxies)
	const gamerulesTransform = structuredClone(toRaw(gamerulesTemp));

	// Retain locked settings because they shouldn't change after a card has been generated
	gamerulesTransform.gridSize = gamerules.gridSize;
	gamerulesTransform.allowSimilar = gamerules.allowSimilar;
	gamerulesTransform.seed = gamerules.seed;

	return gamerulesTransform;
}

// Returns gamerules passed in with transform applied.  Will shrink grid based on grid size.
function transformShrinkGrid(gamerulesTemp) {
	// Start with untransformed version (automatically unwrap proxies)
	const gamerulesTransform = structuredClone(toRaw(gamerulesTemp));

	// If we're forced to use a small grid, overwrite default to small instead
	gamerulesTransform.gridSize = 'small';

	return gamerulesTransform;
}

export function useGameRules() {
	// Returns true if gamerules have been configured
	const areGamerulesSet = computed(() => Object.keys(gamerules).length !== 0);

	// Load data from browser and update local state
	function initializeData() {
		const gamerulesStored = JSON.parse(localStorage.getItem('gamerules'));
		if (gamerulesStored) {
			Object.assign(gamerules, gamerulesStored);
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
	// Will optionally lock some settings for previously-generated cards, or shrink grid if category limit is too low
	function resetGameRules(gamemode, lockSettings, shrinkGrid) {
		if (!defaultGameModes[gamemode]) {
			console.error(`Game mode ${gamemode} not found.`);
			return;
		}

		let transform = defaultGameModes[gamemode];

		// Use defaults, but lock some settings if card has already been generated
		// We need to run this when bingo card is present
		if (lockSettings) {
			transform = transformLocked(transform);
		}

		// Shrink grid if category limit is too low
		if (shrinkGrid) {
			transform = transformShrinkGrid(transform);
		}

		// Update gamerules with transformed defaults
		for (const rule in transform) {
			gamerules[rule] = transform[rule];
		}
		saveToBrowser();
	}

	// Clear game rules from memory and browser
	function clearGameRules() {
		Object.keys(gamerules).forEach(key => delete gamerules[key]);
		localStorage.removeItem('gamerules');
	}

	// Find gamemode by comparing current gamerules against (transformed) defaults
	// Calculating instead of storing gamemode allows us to change the default later
	// without creating conflicts.
	function calculateGameMode(shrinkGrid) {
		// Get defaults, but transform if small grid is required
		const std = (shrinkGrid) ? transformShrinkGrid(defaultGameModes['standard']) : defaultGameModes['standard'];
		const golf = (shrinkGrid) ? transformShrinkGrid(defaultGameModes['golf']) : defaultGameModes['golf'];

		if (objectsAreEqual(gamerules, std)) {
			return 'standard';
		} else if (objectsAreEqual(gamerules, golf)) {
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
		clearGameRules,
		calculateGameMode
	};
}
