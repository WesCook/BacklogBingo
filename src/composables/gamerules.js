import { reactive, readonly } from 'vue';

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

function loadFromBrowser() {
	return localStorage.getItem('gamerules');
}

export function useGameRules() {
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

		for (const rule in defaultGameModes[gamemode]) {
			gamerules[rule] = defaultGameModes[gamemode][rule];
		}
		saveToBrowser();
	}

	// Find gamemode by comparing current gamerules against defaults
	// We could save the gamemode directly, but this allows us to change the defaults later without creating conflicts
	// They'll simply be converted into custom rules
	function calculateGameMode() {
		if (JSON.stringify(gamerules) === JSON.stringify(defaultGameModes.standard)) {
			return 'standard';
		} else if (JSON.stringify(gamerules) === JSON.stringify(defaultGameModes.golf)) {
			return 'golf';
		}
		return 'custom';
	}

	// Loads saved gamerule data and resets if missing
	// Required to start the app
	function initializeData() {
		const gamerulesJSON = loadFromBrowser();

		if (gamerulesJSON) {
			// Looks good, update internal state
			const gamerulesObj = JSON.parse(gamerulesJSON);
			Object.entries(gamerulesObj).forEach(([key, value]) => {
				gamerules[key] = value; // Mutate values to avoid losing reactivity
			});
		} else {
			// Looks bad, set defaults
			resetGameRules('standard');
			console.info('Existing game rules not found.  Defaulting to standard rules.');
		}
	}

	return {
		getGameRules,
		setGameRule,
		resetGameRules,
		calculateGameMode,
		initializeData
	};
}
