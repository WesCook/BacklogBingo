import { ref, readonly } from 'vue';

// Holds the last error message to be set
const error = ref('');

export function useErrors() {
	function getError() {
		return readonly(error);
	}

	// Always logs to console, but only shows in UI if ui=true
	function setError(message, ui = true) {
		console.error('[Backlog Bingo] ' + message);
		if (ui) {
			error.value = message;
		}
	}

	function clearError() {
		error.value = '';
	}

	return {
		getError,
		setError,
		clearError
	};
}
