"use strict"

const rows = 5;
const cols = 5;
const includeFreeTile = 1; // 0 or 1 for free star tile

let availableList = [
	"A game in a genre you don't normally play",
	"A game someone on Tildes has recommended",
	"A game you own on physical media",
	"A game already installed on your computer or console",
	"A downloadable game not found on any digital distribution service",
	"A licensed game",
	"An arcade game",
	"A ROMhack or other significant mod",
	"A co-op game or campaign",
	"Game #20 in your Steam library list, from the top",
	"A game that hasn't been released, ported, remade, or re-released in at least 20 years",
	"Games you've been meaning to give a second chance,",
	"Finish a game that you've been meaning to go back to, and",
	"When the hell did I buy this?",
	"A game you got more than a year ago",
	"A game with less than 50 user ratings on metacritic",
	"A sequel to a game that you've enjoyed in the past (or just another game in the same series)",
	"A game from a studio you haven't heard of before",
	"A game one of your irl friends/family has recommended",
	"A game you can finish within a few hours tops",
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	"Etiam eget magna in magna molestie pretium molestie sit amet urna.",
	"In lorem lacus, dapibus eget velit et, luctus elementum dolor.",
	"Nunc pharetra iaculis nisi vitae auctor.",
	"Suspendisse non nisi finibus, tincidunt leo pharetra, rhoncus dolor. Praesent aliquet risus dui, vitae porta orci posuere eget.",
	"Vivamus molestie nunc orci, id feugiat neque fermentum id. Sed a suscipit neque, a volutpat libero.",
	"Sed in velit et ante commodo vestibulum sit amet sit amet ante.",
	"Nullam tempus augue dolor, at sagittis turpis rhoncus in. Sed sed velit ante.",
	"Vivamus gravida interdum nunc, vitae tincidunt ipsum luctus at.",
	"Phasellus malesuada magna condimentum, aliquet erat et, suscipit libero.",
	"Nulla cursus tempor augue, in mollis mi bibendum vel. Mauris luctus consequat sapien a aliquet.",
	"Maecenas sit amet egestas mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
];

let selectedList = [];
const bingoText = document.getElementById("bingo-text");

// Get random selection of bingo entries
for (let i=0; i<(rows * cols) - includeFreeTile; i++) {
	let selectedIndex = Math.floor(Math.random() * availableList.length);
	selectedList.push(availableList[selectedIndex]);
	availableList.splice(selectedIndex, 1);
}

function generateMarkdown() {
	// Generate markdown
	let output = "";

	// Create header
	output += "|Bingo!";
	for (let i=0; i<cols; i++) {
		output += "|"; // First row, empty header
	}
	output += "\n";
	for (let i=0; i<cols+1; i++) {
		output += "|-"; // Second row, seperators
	}
	output = output.slice(0, -1); // Trim final hyphen
	output += "\n";

	// Keep track of where row ends.  Check after adding any entries.
	let colCount = 0;
	let rowCount = 0;
	const checkEndRow = function() {
		if (colCount === cols) {
			output += "|\n";
			colCount = 0;
			rowCount++;
		}
	}

	// Add rows
	selectedList.forEach(val => {
		// Check for middle free tile
		if (includeFreeTile) {
			if (colCount === Math.floor(cols / 2) && rowCount === Math.floor(rows / 2)) {
				output += "| ★ ";
				colCount++;
			}
			checkEndRow();
		}

		// Add regular value
		output += "|" + val;
		colCount++;
		checkEndRow();
	});

	return output;
}

// Add output to text field
const output = generateMarkdown();
bingoText.innerHTML = output;
