"use strict"

/*******
* Init *
*******/

// Predefined game modes
const gameruleStandard = {
	winCondition: "col-row-diag",
	gridSize: "medium",
	golf: false,
	lockRandom: false,
	allowSimilar: false,
	star: "wildcard"
}
const gameruleGolf = {
	winCondition: "blackout",
	gridSize: "medium",
	golf: true,
	lockRandom: false,
	allowSimilar: false,
	star: "free"
}

// Global state
var gamerule = loadGameRules();
var categories = loadCategories();
var categoriesFullList; // Promise, populated when categories are fetched

// Choose which UI to load
// If no categories are saved, this is likely first-time setup.  Otherwise, try loading the card.
if (categories.length === 0) {
	setUI("gamerules");
} else {
	setUI("bingo");
}


// Initialize game rules from local data, or default to standard
function loadGameRules() {
	let gameruleTemp = JSON.parse(localStorage.getItem("gamerules"));
	if (!gameruleTemp) {
		console.log("Existing game rules not found.  Defaulting to standard rules.");
		gameruleTemp = structuredClone(gameruleStandard);
		localStorage.setItem("gamerules", JSON.stringify(gameruleTemp));
	}
	return gameruleTemp;
}

// Try to load saved categories as array of IDs
function loadCategories() {
	let categories = localStorage.getItem("categories");
	if (!categories) {
		console.log("Saved categories not found.  Loading game rules for first-time setup.");
		categories = [];
	}
	return categories;
}

// Choose which template to embed
function setUI(ui) {
	// Remove old UI
	document.querySelector(".category-wrapper")?.remove();

	// Clone specified template to DOM
	const cloneTemplate = templateName => {
		const template = document.getElementById(templateName + "-template");
		const clone = template.content.cloneNode(true);
		document.body.append(clone);
	}

	// Instantiate new UI and make any useful callbacks
	switch(ui) {
		case "gamerules":
			cloneTemplate("gamerules");
			setupGamerulesUI();
		break;
		case "category":
			cloneTemplate("category");
			setupCategoryUI();
		break;
		case "bingo":
			cloneTemplate("bingo");
		break;
		case "final":
			cloneTemplate("final");
		break;
	}
}

// Start fetching categories
async function fetchCategories() {
	try {
		const response = await fetch("categories.json");
		const categories = await response.json();
		return categories;
	} catch (error) {
		console.error("Error fetching categories", error);
	}
}


/**********************
* Set up Game Rule UI *
**********************/

function setupGamerulesUI() {
	// Call to update game rules DOM when changing game modes or intitializing
	const updateGameRulesDOM = () => {
		document.getElementById("winCondition").value = gamerule.winCondition;
		document.getElementById("gridSize").value = gamerule.gridSize;
		document.getElementById("golf").checked = gamerule.golf;
		document.getElementById("lockRandom").checked = gamerule.lockRandom;
		document.getElementById("allowSimilar").checked = gamerule.allowSimilar;
		document.getElementById("star").value = gamerule.star;
	}
	updateGameRulesDOM();

	// Find game mode by comparing current game rules against defaults
	// We could save game mode directly, but this allows us to change the defaults later without creating conflicts
	const getGameMode = () => {
		let gamemode = "custom";
		if (JSON.stringify(gamerule) === JSON.stringify(gameruleStandard)) {
			gamemode = "standard";
		} else if (JSON.stringify(gamerule) === JSON.stringify(gameruleGolf)) {
			gamemode = "golf";
		}
		return gamemode;
	}

	// Update game mode radio selection
	const gamemode = getGameMode();
	document.querySelector("input[name='game-mode-radio'][value='" + gamemode + "']").checked = true;

	// Enable custom rules fieldset if game mode is custom
	const elemGameRules = document.getElementById("game-rules");
	if (gamemode === "custom") {
		elemGameRules.disabled = false;
	}

	// Watch for clicks on game mode radios, then update game rules, UI, and save changes
	const gameModeRadios = document.querySelectorAll("input[name='game-mode-radio']");
	gameModeRadios.forEach(elem => {
		elem.addEventListener("click", event => {
			let gameModeSelection = event.target.value;
			if (gameModeSelection === "standard") {
				gamerule = structuredClone(gameruleStandard);
				elemGameRules.disabled = true;
				localStorage.setItem("gamerules", JSON.stringify(gamerule));
			}
			else if (gameModeSelection === "golf") {
				gamerule = structuredClone(gameruleGolf);
				elemGameRules.disabled = true;
				localStorage.setItem("gamerules", JSON.stringify(gamerule));
			}
			else if (gameModeSelection === "custom") {
				elemGameRules.disabled = false;
			}

			updateGameRulesDOM();
		});
	});

	// Watch for clicks on game rules controls, save any changes
	const gameRuleControls = document.querySelectorAll(".game-rules input, .game-rules select");
	gameRuleControls.forEach(elem => {
		elem.addEventListener("change", event => {
			// Load correct property based on checkbox or dropdown
			if (event.target.nodeName === "INPUT") {
				gamerule[event.target.id] = event.target.checked;
			}
			else if (event.target.nodeName === "SELECT") {
				gamerule[event.target.id] = event.target.value;
			}

			localStorage.setItem("gamerules", JSON.stringify(gamerule));
		});
	})
}


/*********************
* Set up Category UI *
*********************/

async function setupCategoryUI() {
	// Categories should have long-since fetched, but we'll await the promise just to be sure
	categoriesFullList = await fetchCategories();
	console.log(categoriesFullList);
}



/*

const rows = 5;
const cols = 5;
const includeFreeTile = 1; // 0 or 1 for free star tile

const listFull = ;

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
	const checkboxElems = document.querySelectorAll("#category-list input[type='checkbox']");
	checkboxElems.forEach(elem => {
		elem.addEventListener("change", () => {
			const activeCheckboxesElems = document.querySelectorAll("#category-list input[type='checkbox']:checked");
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
	const listElem = document.getElementById("category-list");
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
	const listSelectedElems = document.querySelectorAll("#category-list input[type='checkbox']:checked + span"); // Who needs IDs and mappings when you have CSS?
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

*/