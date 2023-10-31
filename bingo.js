"use strict"

const rows = 5;
const cols = 5;
const includeFreeTile = 1; // 0 or 1 for free star tile

const listFull = [
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

// Entry point
const elemStep1 = document.getElementById("step1");
const elemStep2 = document.getElementById("step2");
const elemStep3 = document.getElementById("step3");
const elemsSelectionRequired = document.querySelectorAll(".selectionRequired");
const elemSelectionEntered = document.getElementById("selectionEntered");

const requiredChallenges = (rows * cols) - includeFreeTile;
const step1Button = document.getElementById("step1-btn");

init();


function init() {
	// Update required challenges in DOM
	elemSelectionEntered.innerText = listFull.length;
	elemsSelectionRequired.forEach(elem => {
		elem.innerText = requiredChallenges;
	});

	populateList();

	// Attach event listener to each checkbox so we can track the number checked
	const checkboxElems = document.querySelectorAll("#challenge-list input[type='checkbox']");
	checkboxElems.forEach(elem => {
		elem.addEventListener("change", () => {
			const activeCheckboxesElems = document.querySelectorAll("#challenge-list input[type='checkbox']:checked");
			const activeCheckboxes = activeCheckboxesElems.length;

			// Update button
			if (activeCheckboxes >= requiredChallenges) {
				step1Button.disabled = false;
			} else {
				step1Button.disabled = true;
			}

			// Update DOM
			elemSelectionEntered.innerText = activeCheckboxes;
		});
	});
}

// Generate list of challenges and add to DOM
function populateList() {
	const listElem = document.getElementById("challenge-list");
	listFull.forEach(val => {
		let elemLi = document.createElement("li"); // List item
 		let elemLabel = document.createElement("label"); // Label

		// Span
		let elemSpan = document.createElement("span");
		elemSpan.innerText = val;
		
		// Checkbox
		let elemCheck = document.createElement("input");
		elemCheck.type = "checkbox";
		elemCheck.checked = true; // Default to on to encourage more experimenting

		// Create elements
		listElem.appendChild(elemLi);
		elemLi.appendChild(elemLabel);
		elemLabel.append(elemCheck);
		elemLabel.append(elemSpan);
	});
}

// Finished step 1
function finishedSelection() {
	elemStep1.style.display = "none";
	elemStep2.style.display = "block";

	// Build list of selected entries
	const listSelectedElems = document.querySelectorAll("#challenge-list input[type='checkbox']:checked + span"); // Who needs IDs and mappings when you have CSS?
	let listSelected = [];
	listSelectedElems.forEach(elem => listSelected.push(elem.innerText));

	// Get random item from selection, then remove from list
	let randomList = [];
	for (let i=0; i<(rows * cols) - includeFreeTile; i++) {
		let selectedIndex = Math.floor(Math.random() * listSelected.length);
		randomList.push(listSelected[selectedIndex]);
		listSelected.splice(selectedIndex, 1);
	}

	// Add output to text field
	const bingoText = document.getElementById("bingo-text");
	bingoText.innerHTML = generateMarkdown(randomList);
}

// Finished step 2
function finishedCopyMarkdown() {
	elemStep2.style.display = "none";
	elemStep3.style.display = "block";
}

function generateMarkdown(randomList) {
	// Generate markdown
	let output = "| ";

	// Create header
	for (let i=0; i<cols; i++) {
		if (i === Math.floor(cols / 2)) {
			output += "Bingo! ";
		}
		output += "| "; // First row, empty header
	}
	output = output.slice(0, -1); // Trim final space
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
			output += " |\n";
			colCount = 0;
			rowCount++;
		}
	}

	// Add rows
	randomList.forEach(val => {
		// Check for middle free tile
		if (includeFreeTile) {
			if (colCount === Math.floor(cols / 2) && rowCount === Math.floor(rows / 2)) {
				output += "| ★ ";
				colCount++;
			}
			checkEndRow();
		}

		// Add regular value
		output += "| " + val;
		colCount++;
		checkEndRow();
	});

	return output;
}

/*
TODO
- Test results for correctness
- Clean up spacing between rows
*/
