import { reactive, readonly } from 'vue';

// Holds the currently-loaded categories
const categories = reactive([]);

export function useCategories() {
	// Return readonly version of categories
	function getCategories() {
		return readonly(categories);
	}

	// Set categories and save to browser
	function setCategories(categoriesObj) {
		Object.entries(categoriesObj).forEach(([key, value]) => {
			categories[key] = value; // Mutate values to avoid losing reactivity
		});
	}

	return {
		getCategories,
		setCategories
	};
}
