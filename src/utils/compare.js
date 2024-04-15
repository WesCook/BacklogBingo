export function setsAreEqual(set1, set2) {
	return set1.size === set2.size && [...set1].every(value => set2.has(value));
}

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
