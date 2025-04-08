// Returns true if objects match
// Not using stringify for comparison because that's impacted by key order
export function objectsAreEqual(obj1, obj2) {
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (obj1[key] !== obj2[key]) {
			return false;
		}
	}

	return true;
}

// Shuffle array
// Adapted from https://stackoverflow.com/a/12646864
export function shuffleArray(arr) {
	const shuffled = [...arr];
	for (let i = shuffled.length-1; i>0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
