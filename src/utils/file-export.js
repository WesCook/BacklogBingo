import { useErrors } from '../composables/errors.js';

const { setError } = useErrors();

// Utility to export JSON data as a file and trigger a save prompt
export function exportToFile(obj) {
	try {
		// Turn object into JSON string
		const json = JSON.stringify(obj, null, '\t');
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		// Silly anchor method to trigger download
		const filename = generateFilename(obj.name || 'bingo-card');
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 0);

		return { success: true, message: `Successfully exported as '${filename}'.  Please check your downloads folder.` };
	} catch (error) {
		setError(`Export failed with error:\n ${error}`);
		return { success: false, message: 'There was an error exporting the file.  See error log below, or in console.' };
	}
}

// Generate a filename for exported bingo card data
function generateFilename(cardName) {
	cardName = cardName.replace(/ - /g, '-'); // Condense existing dashes to avoid double dashes
	cardName = cardName.replace(/[^a-zA-Z0-9-_]/g, '-'); // Replace remaining special characters with dashes

	const now = new Date();
	const timestamp = [
		now.getFullYear(),
		String(now.getMonth() + 1).padStart(2, '0'),
		String(now.getDate()).padStart(2, '0')
	].join('-');

	return `${cardName}-${timestamp}.json`;
}
