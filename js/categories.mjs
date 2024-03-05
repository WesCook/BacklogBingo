let categoriesListPromise;

// Try to load saved categories as array of IDs
export function getBingoCategories() {
	let categories = JSON.parse(localStorage.getItem("categories"));
	if (!categories) {
		console.log("Saved categories not found.");
		categories = [];
	}
	return categories;
}

// Save array of category IDs to browser storage
export function setBingoCategories(listRandom) {
	localStorage.setItem("categories", JSON.stringify(listRandom));
}

// Called early to set up promise with categories list
export async function preload() {
    categoriesListPromise = fetch("categories.json")
        .then(response => response.json())
        .catch(error => {
            console.error("Error fetching categories", error);
        });
}

// Returns full category list
export async function getCategoriesFull() {
	if (!categoriesListPromise) {
		console.warn("Categories not yet loaded.  Awaiting...");
		await preload();
	}
	return await categoriesListPromise;
}

// Returns visible category list
export async function getCategoriesVisible() {
	if (!categoriesListPromise) {
		console.warn("Categories not yet loaded.  Awaiting...");
		await preload();
	}
	return await categoriesListPromise.then(catList => catList.filter(cat => !cat.hidden));
}

// Shuffle array, used for category list
// From https://stackoverflow.com/a/12646864
export function shuffle(arr) {
	for (let i = arr.length-1; i>0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}
