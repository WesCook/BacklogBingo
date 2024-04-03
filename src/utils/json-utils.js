import { useErrors } from '../composables/errors.js';
const { setError } = useErrors();

// Returns json of provided URL, local or remote.
// Validates different types of errors.  Returns false on error.
export async function downloadJSON(url) {
	// Attempt to download from URL
	try {
		const res = await fetch(url);
		if (!res.ok) {
			setError(`There was an error downloading from the URL.  The status code was ${res.status}.`);
			return false;
		}

		const json = await res.json();
		return json;
	} catch (err) {
		if (err.name === 'SyntaxError') {
			setError(`A file was downloaded, but it could not be read.  Is it a valid JSON file?\n\n${err.name}\n${err.message}`);
		} else if (err.name === 'TypeError') {
			setError(`There was an error downloading from the URL.  An unexpected response was received.\n\n${err.name}\n${err.message}`);
		}
		else {
			setError(`An unknown error occurred.\n\n${err.name}\n${err.message}`);
		}
	}
}

// Accepts JSON/object for validation
// Returns true for valid, false for invalid
export function validateJSON(json) {
	// Verify file has the required keys
	if (
		!(Object.hasOwn(json, 'version')) ||
		!(Object.hasOwn(json, 'name')) ||
		!(Object.hasOwn(json, 'categories'))
	) {
		setError('There was an error parsing the file.  It appears to be missing required keys.');
		return false;
	}

	// Verify there are at least 9 categories (for the smallest size bingo card)
	if (json.categories.length < 9) {
		setError('This JSON is valid, but there are too few categories.  Please include at least nine categories.');
		return false;
	}

	return true;
}
