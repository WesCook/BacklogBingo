"use strict"

const rows = 5;
const cols = 5;
const includeFreeTile = 1; // 0 or 1 for free star tile

const listFull = [
	"You have to tinker in order to get it running",
	"You wanted to play it when you were younger but never did",
	"You can complete it in one sitting",
	"You can complete in only a few hours",
	"Known for its soundtrack",
	"In a genre you don’t normally play",
	"Recommended by someone on Tildes",
	"Recommended by someone IRL",
	"Chosen for you by someone else",
	"Begins with one of your initials",
	"Begins with the first letter of your username",
	"Owned for more than one year",
	"Owned for more than two years",
	"Owned for more than three years",
	"Owned for more than four years",
	"Owned for more than five years",
	"“When the hell did I buy this?”",
	"Has DLC",
	"Has no DLC",
	"Has achievements",
	"Has no achievements",
	"Has minigames",
	"Has cute, feel-good vibes",
	"Has creepy, unsettling vibes",
	"You can save/pet/care for animals",
	"Considered a “classic”",
	"Considered a “cult classic”",
	"Considered a “disappointment”",
	"From now-defunct dev studio",
	"Has one-word title",
	"Has a non-human player character",
	"Has an animal player character",
	"Has an aggregate review score above 90",
	"Has an aggregate review score below 70",
	"Has number somewhere in the title",
	"Has “Super” in the title",
	"Has the letter X somewhere in its title",
	"Has the letter Q somewhere in its title",
	"Has punctuation somewhere in its title",
	"Came out more than 5 years ago",
	"Came out more than 10 years ago",
	"Came out more than 15 years ago",
	"Came out more than 20 years ago",
	"Is one of the oldest games you own",
	"From a developer in a different country",
	"From a studio you haven't heard of before",
	"Solo-dev project",
	"Won an award",
	"You don't think you'll enjoy it",
	"You chose based on title alone",
	"You paid full price for it",
	"You got it on sale",
	"You got from a bundle",
	"You got it as a gift",
	"You own on physical media",
	"You can't remember where you got it from",
	"You regret buying it",
	"From a series you’ve never played",
	"From a series you have played",
	"Part of a trilogy",
	"Already installed",
	"Not found on any distribution service",
	"Licensed game",
	"Arcade game",
	"ROMhack or other significant mod",
	"Co-op game or campaign",
	"Unplayed game #x in your library list (use dice/RNG)",
	"Hasn't been re-released, ported, remade, or re-released in 20+ years",
	"You've been meaning to give a second chance",
	"You've been meaning to go back to",
	"Not super popular (e.g. <50 user reviews on Metacritic)",
	"Your friend swears it is the greatest game ever",
	"La Mulana, you wuss"
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
let storedOutput = "";


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

	// Update list in DOM
	const selectedListElem = document.getElementById("selected-list");
	randomList.forEach(challenge => {
		let elemLi = document.createElement("li");
		elemLi.innerText = challenge;
		selectedListElem.appendChild(elemLi);
	});

	// Add output to text field
	storedOutput = generateMarkdown(randomList); // Update data in outer scope
	const bingoText = document.getElementById("bingo-text");
	bingoText.innerHTML = storedOutput;
}

function copyTable() {
	// Play Copied! animation and pause at end of animation
	const elemCopy = document.getElementById("copy-status");
	elemCopy.style.animationPlayState = "running";
	elemCopy.addEventListener("animationiteration", () => {
		elemCopy.style.animationPlayState = "paused";
	});

	// Copy to clipboard
	navigator.clipboard.writeText(storedOutput);
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
		output += "|:-:"; // Second row, seperators
	}
	output = output.slice(0, -3); // Trim final hyphen
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
		output += "| " + val + " ";
		colCount++;
		checkEndRow();
	});

	return output;
}
