// Accepts JSON/object for validation
// Returns true for valid, false for invalid
export function validate(json) {
	// Verify file has the required keys
	if (
		!(Object.hasOwn(json, 'version')) ||
		!(Object.hasOwn(json, 'name')) ||
		!(Object.hasOwn(json, 'categories'))
	) {
		alert('There was an error parsing the file.  It appears to be missing required keys.');
		console.error('JSON file is missing required keys');
		return false;
	}

	// Verify there are at least 9 categories (for the smallest size bingo card)
	if (json.categories.length < 9) {
		alert('This JSON is valid, but there are too few categories.  Please include at least nine categories.');
		console.error('Too few bingo categories in JSON');
		return false;
	}

	return true;
}
