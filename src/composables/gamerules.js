import { reactive, computed } from 'vue';

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

export function useGameRules() {
	// Return readonly version of gamerules
	// TODO: Is readonly() better?  It seems like computed() is only needed when it's an inner variable.
	function getGameRules() {
		return computed(() => gamerules);
	}

	// Set specific game rule with value
	function setGameRule(rule, value) {
		gamerules[rule] = value;
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

	return {
		getGameRules,
		setGameRule,
		resetGameRules,
		calculateGameMode
	};
}
