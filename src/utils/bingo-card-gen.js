import { useGameRules } from '../composables/gamerules.js';
import { useCategories } from '../composables/categories.js';
import { useBingo } from '../composables/bingo.js';
import { useErrors } from '../composables/errors.js';
import { shuffleArray } from '../utils/object-utils.js';
import { detectDynamicCategory, parseDynamicCategory } from '../utils/json-parse.js';

const { getGameRules } = useGameRules();
const { getCategoryNumber } = useCategories();
const { setBingoCard } = useBingo();
const { setError } = useErrors();

// Generate and save the bingo card.  Returns true on success.
export function generateBingoCard(name, categories) {
	const chosenCategories = chooseCategories(categories);
	if (!chosenCategories) {
		return false;
	}

	// Evaluate dynamic categories
	for (const cat of chosenCategories) {
		if (detectDynamicCategory(cat.cat)) {
			cat.cat = parseDynamicCategory(cat.cat);
		}
	}

	// Create card
	const bingoCard = {
		name: name,
		categories: chosenCategories
	};
	setBingoCard(bingoCard);

	localStorage.removeItem('categoryList');
	return true;
}

// Returns array of categories based on required grid size
// Tries to respect allowSimilar.  Will fall back when more entries are required.
function chooseCategories(categories) {
	// Get gamerules
	const gamerules = getGameRules();
	const allowSimilar = gamerules.allowSimilar;
	const categoryNumber = getCategoryNumber(gamerules.gridSize);

	// Store pools of categories for sorting
	const catPoolPrimary = shuffleArray(categories); // Holds all categories initially
	const catPoolSecondary = []; // Fallback pool used when allowSimilar is false.  Reused groups are sent here.
	const catFinalList = []; // The final list of saved bingo categories
	const usedGroups = []; // Array of strings of category groups already chosen from primary pool

	// Fill bingo list from primary pool
	for (const cat of catPoolPrimary) {
		if (allowSimilar || !cat.group) {
			catFinalList.push(cat);
		} else {
			if (cat.group && !usedGroups.includes(cat.group)) {
				// Allow Similar is false, and group hasn't been used yet
				catFinalList.push(cat);
				usedGroups.push(cat.group);
			}
			else {
				// Cat group already used
				catPoolSecondary.push(cat);
			}
		}

		// List was filled with enough categories, so we're done
		if (catFinalList.length >= categoryNumber) {
			break;
		}
	}

	// If we don't have enough from primary pool, fill the rest from secondary
	// These should still be roughly randomized from before
	while (catFinalList.length < categoryNumber && catPoolSecondary.length > 0) {
		console.warn('Not enough unique categories, filling from secondary pool');
		catFinalList.push(catPoolSecondary.shift());
	}

	// If we still don't have enough categories, we have problems.  But this shouldn't happen.
	if (catFinalList.length < categoryNumber) {
		setError(`A card could not be generated.  There were not enough categories provided (${catFinalList.length}/${categoryNumber}).`);
		return;
	}

	// Remove group as it's no longer needed
	catFinalList.forEach(cat => delete cat.group);

	return catFinalList;
}
