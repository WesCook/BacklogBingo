// Holds player's game rules
let gameruleCache;


// Initialize game rules from local data.  If it cannot be found, it defaults to the standard ruleset.
// This only needs to happen once.  After this, gameruleStore will hold an updated copy.
export function initialLoad() {
	const gamerule = JSON.parse(localStorage.getItem("gamerules"));
	if (gamerule) {
		gameruleCache = gamerule;
	} else {
		console.log("Existing game rules not found.  Defaulting to standard rules.");
		reset("standard");
	}
}

// Reset game rules to preset, then save.  Usually from changing game mode in UI or initializing new data.
export function reset(gamemode) {
	if (defaultGameModes[gamemode]) {
		set(defaultGameModes[gamemode]);
	} else {
		console.error(`Game mode ${gamemode} not found.`);
	}
}

export function get() {
	return gameruleCache;
}

export function set(gamerule) {
	gameruleCache = structuredClone(gamerule); // Deep copy to avoid unexpected changes later
	saveToBrowser(gamerule);
}

function saveToBrowser(gamerule) {
	localStorage.setItem("gamerules", JSON.stringify(gamerule));
}

// Find game mode by comparing current game rules against defaults
// We could save the game mode directly, but this allows us to change the defaults later without creating conflicts
// They'll simply be converted into custom rules
export function getGameMode(gamerule) {
	let gamemode = "custom";
	if (JSON.stringify(gamerule) === JSON.stringify(defaultGameModes.standard)) {
		gamemode = "standard";
	} else if (JSON.stringify(gamerule) === JSON.stringify(defaultGameModes.golf)) {
		gamemode = "golf";
	}
	return gamemode;
}

// Predefined game modes
const defaultGameModes = {
	"standard": {
		winCondition: "col-row-diag",
		gridSize: "medium",
		golf: false,
		lockRandom: false,
		allowSimilar: false,
		star: "wildcard"
	},
	"golf": {
		winCondition: "blackout",
		gridSize: "medium",
		golf: true,
		lockRandom: false,
		allowSimilar: false,
		star: "free"
	}
}
