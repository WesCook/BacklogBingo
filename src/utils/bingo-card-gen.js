import { useGameRules } from '../composables/gamerules.js';
import { useCategories } from '../composables/categories.js';
import { useBingo } from '../composables/bingo.js';
import { useErrors } from '../composables/errors.js';
import { getHashFromString, createSeededRandom, shuffleArray } from '../utils/math-utils.js';
import { parseDynamicCategory } from '../utils/json-parse.js';

const { getGameRules } = useGameRules();
const { getCategoryNumber } = useCategories();
const { setBingoCard } = useBingo();
const { setError } = useErrors();

// Generate and save the bingo card.  Returns true on success.
export function generateBingoCard(name, categories) {
	// Generate random sequence for use in category selection, using deterministic seed if provided
	const gamerules = getGameRules();
	const hash = getHashFromString(gamerules.seed);
	const rng = (gamerules.seed) ? createSeededRandom(hash) : Math.random;

	// Choose categories
	const chosenCategories = chooseCategories(categories, rng);
	if (!chosenCategories) {
		return false;
	}

	// Evaluate dynamic categories
	for (const cat of chosenCategories) {
		if (cat.dynamic) {
			cat.cat = parseDynamicCategory(cat.cat, rng);
		}
	}

	// Trim excess metadata not needed for card
	chosenCategories.forEach(cat => {
		delete cat.group;
		delete cat.dynamic;
	});

	// Create card
	setBingoCard({
		name: name,
		categories: chosenCategories
	});

	localStorage.removeItem('categoryList');
	return true;
}

function chooseCategories(categories, rng) {
	const gamerules = getGameRules();
	const allowSimilar = gamerules.allowSimilar;
	const categoryNumber = getCategoryNumber(gamerules.gridSize);

	let workingPool = shuffleArray(categories, rng); // Holds a shuffled version of all initial categories
	let discardPool = []; // Fallback pool used when allowSimilar is false.  Categories with reused groups are sent here.
	const finalList = []; // The final list of saved bingo categories
	const usedGroups = new Set(); // Set of category groups already used by working pool

	console.log(`Choosing ${categoryNumber} categories from ${categories.length} total.  ${(allowSimilar) ? 'Allowing similar groups' : 'No similar groups allowed'}.`);

	// If we somehow don't have enough categories, return early and don't loop through them
	if (categories.length < categoryNumber) {
		setError(`Not enough categories provided (${categories.length}/${categoryNumber}).`);
		return [];
	}

	console.groupCollapsed('Scanning categories...');
	while (finalList.length < categoryNumber && (workingPool.length > 0 || discardPool.length > 0)) {
		if (workingPool.length === 0) {
			// When working pool is exhausted, reset group tracking and return discarded categories to working pool.  Categories should still be shuffled from before (and reshuffling here might indefinitely delay the loop).
			console.log(`%cWorking pool exhausted.  Returning ${discardPool.length} discarded categories.`, 'color: orange;');
			workingPool = discardPool;
			discardPool = [];
			usedGroups.clear();
		}

		const cat = workingPool.shift();

		if (allowSimilar || !cat.group || !usedGroups.has(cat.group)) {
			finalList.push(cat);
			console.log(`Selected category '${cat.cat}'${(cat.group) ? ` from group ID ${cat.group}` : ''}.`);
			if (cat.group) {
				usedGroups.add(cat.group);
			}
		} else {
			discardPool.push(cat);
			console.log(`Discarded category '${cat.cat}' from group ID ${cat.group} (already used).`);
		}
	}
	console.groupEnd();

	return finalList;
}
