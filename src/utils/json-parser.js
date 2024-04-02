// Validates file contents as string and parses into object
// Returns false for invalid input, and the parsed object when valid
export function validateAndParse(fileStr) {
	// File has data
	if (!fileStr) {
		alert('There was an error parsing the file.  It appears to be empty.');
		console.error('JSON file is empty');
		return false;
	}

	// File is readable as JSON
	let fileObj;
	try {
		fileObj = JSON.parse(fileStr);
	} catch (err) {
		alert('There was an error parsing the file.  Is it a valid JSON file?');
		console.error(err);
		return false;
	}

	// File has the required keys
	if (
		!(Object.hasOwn(fileObj, 'version')) ||
		!(Object.hasOwn(fileObj, 'name')) ||
		!(Object.hasOwn(fileObj, 'categories'))
	) {
		alert('There was an error parsing the file.  It appears to be missing required keys.');
		console.error('JSON file is missing required keys');
		return false;
	}

	// There are at least 9 categories (for the smallest size bingo card)
	if (fileObj.categories.length < 9) {
		alert('This JSON is valid, but there are too few categories.  Please include at least nine categories.');
		console.error('Too few bingo categories in JSON');
		return false;
	}

	return fileObj;
}
