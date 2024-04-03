// Returns json of provided URL, local or remote.
// Validates different types of errors.  Returns false on error.
export async function downloadJSON(url) {
	// Attempt to download from URL
	try {
		const res = await fetch(url);
		if (!res.ok) {
			console.log('A network error occured.');
			console.error(res);
			alert(`There was an error downloading from the URL.  The status code was ${res.status}.`);
			return false;
		}

		const json = await res.json();
		return json;
	} catch (err) {
		if (err.name === 'SyntaxError') {
			console.log(`Failed to parse ${url} as JSON`);
			console.error(err.message);
			alert('A file was downloaded, but it could not be read.  Is it a valid JSON file?');
		} else if (err.name === 'TypeError') {
			console.error(err.message);
			alert('There was an error downloading from the URL.  An unexpected response was received.');
		}
		else {
			console.error(err.name, err.message);
			alert('An unknown error occurred.');
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
		alert('There was an error parsing the file.  It appears to be missing required keys.');
		console.error('JSON file is missing required keys.');
		return false;
	}

	// Verify there are at least 9 categories (for the smallest size bingo card)
	if (json.categories.length < 9) {
		alert('This JSON is valid, but there are too few categories.  Please include at least nine categories.');
		console.error('Too few bingo categories in JSON.');
		return false;
	}

	return true;
}
