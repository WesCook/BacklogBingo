// Shuffle an array
// Optionally supports custom prng for seeded sequences
export function shuffleArray(arr, rng = Math.random) {
	const shuffled = [...arr];

	// Durstenfeld shuffle adapted from https://stackoverflow.com/a/12646864
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}

// Returns a PRNG function (SplitMix32) that produces a deterministic sequence of values from 0 to 1 from a numeric seed
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md#splitmix32
export function createSeededRandom(seed) {
	return () => {
		seed |= 0; // Force seed to be a 32-bit integer
		seed = (seed + 0x9e3779b9) | 0; // Add the constant (the golden ratio in hex) to the seed to improve randomness and distribution

		// First mixing step: xor and shift, then multiply
		let t = seed ^ (seed >>> 16);
		t = Math.imul(t, 0x21f0aaad);
		// Second mixing step: xor and shift, then multiply
		t = t ^ (t >>> 15);
		t = Math.imul(t, 0x735a2d97);
		// Third mixing step: xor and shift, then ensure unsigned positive
		t = (t ^ (t >>> 15)) >>> 0;

		// Scale to [0,1) by dividing by the maximum 32-bit unsigned integer value (2^32)
		return t / 4294967296;
	};
}

// Hash function (DJB2a) that converts strings to numbers
export function getHashFromString(str) {
	let hash = 5381; // Initialize hash with a prime (5381) for better distribution
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 33) ^ str.charCodeAt(i); // Multiply the current hash by 33 (prime) and XOR to spread out the bits and reduce collisions
	}
	return hash >>> 0; // Convert it to an unsigned 32-bit integer
}
