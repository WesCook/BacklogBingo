import { reactive, readonly } from 'vue';

// Holds the currently-loaded categories
const categories = reactive([]);

export function useCategories() {
	// Return readonly version of categories
	function getCategories() {
		return readonly(categories);
	}

	return {
		getCategories,
	};
}
