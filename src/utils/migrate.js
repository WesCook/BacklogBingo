const CURRENT_VERSION = 2;

function migrate1to2(json) {
	if (!json.categories) return json;

	// Remap cat > name in category naming
	for (const cat of json.categories) {
		if (cat.cat && !cat.name) {
			cat.name = cat.cat;
			delete cat.cat;
		}
	}

	json.version = 2;
	console.info('%cMigrated bingo card to v2', 'color: orange;');

	return json;
}

export function migrate(json) {
	if (!json) return json;

	// Return early if current
	const version = json.version || 1; // Assume v1 if unlisted
	if (version >= CURRENT_VERSION) {
		return json;
	}

	// Otherwise, apply migrations
	// Use switch with fall-through to apply sequentially
	let migrated = structuredClone(json);
	switch(version) {
		case 1:
			migrated = migrate1to2(migrated);
			// Falls through
		//case 2: (example)
			//migrated = migrate2to3(migrated);
	}

	return migrated;
}

export function getCurrentVersion() {
	return CURRENT_VERSION;
}
