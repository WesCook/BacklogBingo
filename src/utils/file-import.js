import { useErrors } from '../composables/errors.js';

import { detectDynamicCategory, parseDynamicCategory } from '../utils/json-parse.js';

const { setError } = useErrors();

// Accepts category list json, and verifies all dynamic categories are valid by parsing them
// Returns if successful, and updates the error log with any failures
export function validateDynamicCategories(json) {
	const allErrors = [];

	// Try parsing each category
	for (const cat of json.categories) {
		if (detectDynamicCategory(cat.name)) {
			const { errors } = parseDynamicCategory(cat.name);
			if (errors.length) {
				allErrors.push(...errors);
			}
		}
	}

	// Update error log if any are found
	if (allErrors.length) {
		setError(allErrors.join('\n\n'));
		return false;
	}

	return true;
}

// Returns copy of json with dynamic categories receiving cat.dynamic property
export function markDynamicCategories(jsonIn) {
	const json = structuredClone(jsonIn);

	for (const cat of json.categories) {
		if (detectDynamicCategory(cat.name)) {
			cat.dynamic = true;
		}
	}

	return json;
}
