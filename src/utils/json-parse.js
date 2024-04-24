import { useErrors } from '../composables/errors.js';

const { setError } = useErrors();

// Parses provided URL for json, local or remote
// Reports network and JSON parsing errors.  Returns json on success, false on error.
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

// Additional validation for JSON file or regular object
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

// Detects if string contains dynamic category for additional parsing
export function detectDynamicCategory(catName) {
	const regex = /(NUMBER|CHOOSE)\[[^\]]+\]/g;
	return regex.test(catName);
}

// Parses dynamic tags in text, validates them, and returns a new string.  Supports:
// - NUMBER[1,5] - Chooses a random integer from min to max values
// - CHOOSE[term1|term2|term3...] - Chooses a term/phrase separated by pipes
export function parseDynamicCategory(catName) {
	return catName.replaceAll(/(NUMBER|CHOOSE)\[([^\]]+)\]/g, (match, type, values) => {
		if (type === 'NUMBER') {
			// Cast to number and destructure
			const [min, max] = values.split(',').map(Number);

			// Error checking
			if (values.split(',').length > 2) {
				setError(`A dynamic category contains too many values ${match} in the following line:\n\n${catName}\n\nExpected format: NUMBER[min,max]`);
			}
			if (isNaN(min) || isNaN(max) || min >= max) {
				setError(`A dynamic category contains an invalid range ${match} in the following line:\n\n${catName}\n\nExpected format: NUMBER[min,max]`);
			}
			if (!Number.isInteger(min) || !Number.isInteger(max)) {
				setError(`A dynamic category contains a non-integer ${match} in the following line:\n\n${catName}\n\nOnly integers are supported.`);
			}

			return getRandomNumber(min, max);
		} else if (type === 'CHOOSE') {
			const terms = values.split('|');

			// Error checking
			if (terms.length < 2) {
				setError(`A dynamic category contains too few values ${match} in the following line:\n\n${catName}\n\nExpected format: CHOOSE[term1|term2|term3...] with at least two terms.`);
			}

			return chooseRandomWord(terms);
		}
	});
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseRandomWord(terms) {
	const index = Math.floor(Math.random() * terms.length);
	return terms[index];
}
