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

// Generates colors based on light or dark mode
// TODO: In the future, light-dark() can be used to assign both light and dark colors at once.
// Not an option now as media queries can't be used inline, where this function is used.
// No biggie except this implementation won't detect changes after page load.
export function getThemedColors(amount) {
	const darkMode = window?.matchMedia('(prefers-color-scheme: dark)').matches;
	let colors;
	if (darkMode) {
		colors = generateHSL(amount, 60, 70);
	} else {
		colors = generateHSL(amount, 70, 40);
	}
	return colors;
}
