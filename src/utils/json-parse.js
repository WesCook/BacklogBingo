import { useErrors } from '../composables/errors.js';

import Ajv from 'ajv';
import categorySchema from '../schemas/category-list.json';
import bingoImportSchema from '../schemas/bingo-import.json';

const { setError } = useErrors();

const ajv = new Ajv({ allErrors: true });
const validateCategoryList = ajv.compile(categorySchema);
const validateBingoImport = ajv.compile(bingoImportSchema);

// Validate JSON against appropriate schema validator
// Returns true for valid, false for invalid
export function validateJSON(json, type) {
	let valid = false;
	let errors = [];

	if (type === 'bingo-import') {
		valid = validateBingoImport(json);
		errors = validateBingoImport.errors;
	} else if (type === 'category-list') {
		valid = validateCategoryList(json);
		errors = validateCategoryList.errors;
	}

	if (!valid) {
		setError('The JSON contained the following errors:\n' + formatErrors(errors));
	}

	return valid;
}

// Make errors a little more human-friendly
function formatErrors(errors) {
	return errors.map(error => {
		// Convert from `/foo/bar/0/baz` to `foo.bar[0].baz`
		const path = error.instancePath
			.replace(/\//g, '.') // Slash to dot
			.replace(/^\./, '') // Remove leading dot
			.replace(/\.(\d+)(\.|$)/g, '[$1]$2'); // Turn `.0.` into `[0].`

		const context = path || 'Category list';

		switch (error.keyword) {
			case 'required':
				return `- ${context} is missing required property '${error.params.missingProperty}'`;
			case 'type':
				return `- ${context} should be a ${error.params.type}`;
			case 'additionalProperties':
				return `- ${context} has an unexpected property '${error.params.additionalProperty}'`;
			case 'enum':
				return `- ${context} must be one of: ${error.params.allowedValues.join(', ')}`;
			case 'minItems':
				return `- ${context} should have at least ${error.params.limit} items`;
			case 'maxItems':
				return `- ${context} should have no more than ${error.params.limit} items`;
			case 'minLength':
				return `- ${context} should be at least ${error.params.limit} characters long`;
			case 'maxLength':
				return `- ${context} should be no more than ${error.params.limit} characters long`;
			case 'pattern':
				return `- ${context} does not match the required pattern`;
			case 'format':
				return `- ${context} must be a valid ${error.params.format}`;
			default:
				return `- ${context} ${error.message}`;
		}
	}).join('\n');
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
	const errors = [];
	const result = catName.replaceAll(/(NUMBER|CHOOSE)\[([^\]]+)\]/g, (match, type, values) => {
		if (type === 'NUMBER') {
			// Cast to number and destructure
			const [min, max] = values.split(',').map(Number);

			// Error checking
			if (values.split(',').length > 2) {
				errors.push(`- A dynamic category contains too many values in the following line:\n'${catName}'\nExpected format: NUMBER[min,max]`);
			}
			if (isNaN(min) || isNaN(max) || min >= max) {
				errors.push(`- A dynamic category contains an invalid range ${match} in the following line:\n'${catName}'\nExpected format: NUMBER[min,max]`);
			}
			if (!Number.isInteger(min) || !Number.isInteger(max)) {
				errors.push(`- A dynamic category contains a non-integer in the following line:\n'${catName}'\nOnly integers are supported.`);
			}

			return chooseRandomNumber(rng, min, max);
		} else if (type === 'CHOOSE') {
			const terms = values.split('|');

			// Error checking
			if (terms.length < 2) {
				errors.push(`- A dynamic category contains too few values in the following line:\n'${catName}'\nExpected format: CHOOSE[term1|term2|term3...] with at least two terms.`);
			}

			return chooseRandomWord(rng, terms);
		}
	});
	return { result, errors };
}

function chooseRandomNumber(rng, min, max) {
	return Math.floor(rng() * (max - min + 1)) + min;
}

function chooseRandomWord(rng, terms) {
	const index = Math.floor(rng() * terms.length);
	return terms[index];
}
