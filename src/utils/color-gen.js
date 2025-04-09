// Generate spread of colors based on number of groups
// Adapted from https://mika-s.github.io/javascript/colors/hsl/2017/12/05/generating-random-colors-in-javascript.html
export function generateHSL(amount, saturation, lightness) {
	const colors = [];
	const hueDelta = Math.trunc(360 / amount);
	for (let i=0; i<amount; i++) {
		const hue = i * hueDelta;
		colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
	}
	return colors;
}

// Generates colors for both light and dark across specified range, returned as light-dark() CSS function
export function getThemedColors(amount) {
	const light = generateHSL(amount, 70, 40);
	const dark = generateHSL(amount, 60, 70);

	const themedColors = [];
	for (let i=0; i<amount; i++) {
		themedColors.push(`light-dark(${light[i]}, ${dark[i]})`);
	}

	return themedColors;
}
