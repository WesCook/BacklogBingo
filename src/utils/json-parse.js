import { useErrors } from '../composables/errors.js';

const { setError } = useErrors();

// Define schema for category lists
const categorySchema = {
	version: { type: Number, required: true },
	name: { type: String, required: true },
	description: { type: String },
	gamerules: {
		winCondition: ['row-col', 'row-col-diag', 'blackout'],
		star: ['wildcard', 'free', 'disabled'],
		allowDuplicates: { type: Boolean },
		gridSize: ['small', 'medium', 'large'],
		allowSimilar: { type: Boolean },
		seed: { type: String }
	},
	categories: { type: Array }
};

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
	// Validate json against schema, checking for missing fields, extra fields, or type errors
	if (!validateSchema(json, categorySchema)) {
		return false;
	}

	// Verify there are at least 9 categories (for the smallest size bingo card)
	if (json.categories.length < 9) {
		setError('This JSON is valid, but there are too few categories.  Please include at least nine categories.');
		return false;
	}

	return true;
}

// Accepts schema definition and json object to validate against
function validateSchema(obj, schema) {
	const preamble = 'There was an error parsing the file.';

	// Report any unknown keys in JSON
	const unknownKeys = Object.keys(obj).filter(key => !(key in schema));
	if (unknownKeys.length > 0) {
		setError(`${preamble} Unknown key(s) found: ${unknownKeys.join(', ')}.`);
		return false;
	}

	// Loop through each property in the schema
	for (const key in schema) {
		const rule = schema[key]; // The relevant validation rule for this key/property
		const isRequired = rule.required === true; // If the rule requires the property to be present in the object
		const type = inferSchemaType(rule); // The expected type as defined by the schema
		const value = obj[key]; // The value stored in the property

		// Check for required keys
		if (isRequired && !(key in obj)) {
			setError(`${preamble} Missing required key: "${key}".`);
			return false;
		}

		// Skip validation if optional property and not present
		if (!(key in obj))
			continue;

		// Checking that values are acceptable for selected type
		switch (type) {
			// Rule is parsed as array with enum values
			case 'enum':
				if (!rule.includes(value)) {
					setError(`${preamble} Invalid value for "${key}": "${value}". Expected one of: ${rule.join(', ')}.`);
					return false;
				}
				break;

			// Rule is parsed as nested object, which requires recursive validation
			case 'object':
				if (typeof value !== 'object' || value === null || Array.isArray(value)) {
					setError(`${preamble} Expected "${key}" to be an object.`);
					return false;
				}
				if (!validateSchema(value, rule)) {
					return false; // Nested schema handles its own errors
				}
				break;

			// Rule is parsed as array literal (eg. category list)
			case 'array':
				if (!Array.isArray(value)) {
					setError(`${preamble} Expected "${key}" to be an array.`);
					return false;
				}
				break;

			// Rule is parsed as primitive type
			case 'string':
			case 'number':
			case 'boolean':
				if (typeof value !== type) {
					setError(`${preamble} Expected "${key}" to be of type "${type}".`);
					return false;
				}
				break;

			default:
				setError(`${preamble} Unknown type for "${key}".`);
				return false;
		}
	}

	return true;
}

// Returns specific type from schema so the validator knows what to expect
// The schema allows a few different formats (eg. arrays might be an enum or user-created list), so this function helps simplify that
// Remember that this reads the schema's rule, and not the value from the JSON
function inferSchemaType(rule) {
	const typeMap = {
		String: 'string',
		Number: 'number',
		Boolean: 'boolean',
		Object: 'object',
		Array: 'array'
	};

	// Enum: rule is an array of values
	if (Array.isArray(rule)) {
		return 'enum';
	}

	if (typeof rule === 'object' && rule !== null) {
		// Rule explicitly provides a constructor function (eg. String)
		if (typeof rule.type === 'function' && typeMap[rule.type.name]) {
			return typeMap[rule.type.name];
		}

		// No explicit type: treat as nested object schema
		return 'object';
	}

	// Anything else is malformed
	throw new Error('Invalid schema rule');
}

// Detects if string contains dynamic category for additional parsing
export function detectDynamicCategory(catName) {
	const regex = /(NUMBER|CHOOSE)\[[^\]]+\]/g;
	return regex.test(catName);
}

// Parses dynamic tags in text, validates them, and returns a new string
// Optionally supports custom prng for seeded sequences
// Dynamic Tags supported:
// - NUMBER[1,5] - Chooses a random integer from min to max values
// - CHOOSE[term1|term2|term3...] - Chooses a term/phrase separated by pipes
export function parseDynamicCategory(catName, rng = Math.random) {
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

			return chooseRandomNumber(rng, min, max);
		} else if (type === 'CHOOSE') {
			const terms = values.split('|');

			// Error checking
			if (terms.length < 2) {
				setError(`A dynamic category contains too few values ${match} in the following line:\n\n${catName}\n\nExpected format: CHOOSE[term1|term2|term3...] with at least two terms.`);
			}

			return chooseRandomWord(rng, terms);
		}
	});
}

function chooseRandomNumber(rng, min, max) {
	return Math.floor(rng() * (max - min + 1)) + min;
}

function chooseRandomWord(rng, terms) {
	const index = Math.floor(rng() * terms.length);
	return terms[index];
}
