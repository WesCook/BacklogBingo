"use strict"

/*******
* Init *
*******/

import * as gamerule from "./gamerule.mjs";
import * as categories from "./categories.mjs";

gamerule.initialLoad(); // Get game rules from browser, or default to standard
categories.preload(); // Start fetching full categories list in the background

// Choose which UI to load
// If no categories are saved, this is likely a first-time setup.  Otherwise, try loading the bingo card.
if (categories.getBingoCategories().length === 0) {
	setUI("gamerules");
} else {
	setUI("bingo");
}


// Choose which template to embed
function setUI(ui) {
	// Remove old UI if it exists
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
			setupBingoUI();
		break;
		default:
			console.error("Unknown UI", ui);
	}

	// Scroll to top of page
	// (It was at this point I realized I'd accidentally created an SPA)
	window.scrollTo(top);
}


/***********************
* Set up Game Rules UI *
***********************/

// TODO: Lock center star option once cats are generated.  Or only allow changing between free space and wildcard.

// Initialize game rules screen
function setupGamerulesUI() {
	// Call to update game rules DOM when changing game modes or intitializing
	const updateGameRulesDOM = () => {
		const gameruleTemp = gamerule.get();
		document.getElementById("winCondition").value = gameruleTemp.winCondition;
		document.getElementById("gridSize").value = gameruleTemp.gridSize;
		document.getElementById("golf").checked = gameruleTemp.golf;
		document.getElementById("lockRandom").checked = gameruleTemp.lockRandom;
		document.getElementById("allowSimilar").checked = gameruleTemp.allowSimilar;
		document.getElementById("star").value = gameruleTemp.star;
	};
	updateGameRulesDOM();

	// Update game mode radio selection based on game rules
	const gamemode = gamerule.getGameMode(gamerule.get());
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
			const elemGameRules = document.getElementById("game-rules");
			let gameModeSelection = event.target.value;
			if (gameModeSelection === "standard") {
				gamerule.reset("standard");
				elemGameRules.disabled = true;
			}
			else if (gameModeSelection === "golf") {
				gamerule.reset("golf");
				elemGameRules.disabled = true;
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
			let gameruleChanges = gamerule.get();

			// Load relevant property based on checkbox or dropdown
			if (event.target.nodeName === "INPUT") {
				gameruleChanges[event.target.id] = event.target.checked;
			}
			else if (event.target.nodeName === "SELECT") {
				gameruleChanges[event.target.id] = event.target.value;
			}

			gamerule.set(gameruleChanges);
		});
	});

	// Attach event listener to Select Categories button to change UI
	const btn = document.getElementById("btn-select-categories");
	btn.addEventListener("click", () => {
		setUI("category");
	})
}


/*********************
* Set up Category UI *
*********************/

async function setupCategoryUI() {
	// Categories should have long-since fetched, but we'll await the promise just to be sure
	const categoriesVisible = await categories.getCategoriesVisible();
	const gameruleTemp = gamerule.get();

	// Get DOM elements
	const elemsSelectionRequired = document.querySelectorAll(".selectionRequired");
	const elemSelectionEntered = document.getElementById("selectionEntered");

	// Calculate required category number from size of grid and star
	// Using 0/1 instead of true/false so it can be used in math operations
	let includeFreeTile = 0;
	if (gameruleTemp.star === "free" || gameruleTemp.star === "wildcard") {
		includeFreeTile = 1;
	}

	// Get rows and cols from grid size
	const gridSizeMap = {
		small: {rows: 3, cols: 3},
		medium: {rows: 5, cols: 5},
		large: {rows: 7, cols: 7}
	};
	const {rows, cols} = gridSizeMap[gameruleTemp.gridSize];

	// Update required categories in DOM
	const requiredCategoryNumber = (rows * cols) - includeFreeTile;
	elemSelectionEntered.innerText = categoriesVisible.length;
	elemsSelectionRequired.forEach(elem => {
		elem.innerText = requiredCategoryNumber;
	});

	// Generate list of categories and add to DOM
	const listElem = document.getElementById("category-list");
	categoriesVisible.forEach(cat => {
		let elemLi = document.createElement("li"); // List item
		let elemLabel = document.createElement("label"); // Label

		// Span
		let elemSpan = document.createElement("span");
		elemSpan.innerText = cat.msg;
		
		// Checkbox
		let elemCheck = document.createElement("input");
		elemCheck.type = "checkbox";
		elemCheck.id = "cat-" + cat.id;
		elemCheck.checked = true; // Default to on to encourage more experimenting

		// Create elements
		listElem.appendChild(elemLi);
		elemLi.appendChild(elemLabel);
		elemLabel.append(elemCheck);
		elemLabel.append(elemSpan);
	});

	// Attach event listener to each checkbox so we can track the number checked
	const btn = document.getElementById("btn-generate-card");
	const checkboxElems = document.querySelectorAll(".category-list input[type='checkbox']");
	checkboxElems.forEach(elem => {
		elem.addEventListener("change", () => {
			const elemsCatChecked = document.querySelectorAll(".category-list input[type='checkbox']:checked");
			const catCheckedCount = elemsCatChecked.length;

			// Update count and button
			elemSelectionEntered.innerText = catCheckedCount;
			if (catCheckedCount >= requiredCategoryNumber) {
				btn.disabled = false;
			} else {
				btn.disabled = true;
			}
		});
	});

	// Attach event listener to Generate Card button
	btn.addEventListener("click", () => {
		// Store list of selected category IDs as array
		let catCheckedIDs = []; // List of category IDs that were checked, before they're turned into real objects and stored in catPoolPrimary
		const catPoolPrimary = []; // Holds all checked categories initially.  If allowSimilar is false, groups move to secondary pool as fallback
		const catPoolSecondary = [];
		const catBingoList = []; // The final list of saved bingo categories
		const usedGroups = []; // Array of strings of category groups already chosen from primary pool
		const allowSimilar = gamerule.get().allowSimilar;

		// Create array of all checked off category IDs
		const elemsCatChecked = document.querySelectorAll(".category-list input[type='checkbox']:checked");
		elemsCatChecked.forEach(elem => catCheckedIDs.push(parseInt(elem.id.substring(4))));

		// Shuffle order of IDs
		catCheckedIDs = categories.shuffle(catCheckedIDs);

		// Add category objects to primary pool based on IDs
		catCheckedIDs.forEach(catID => {
			catPoolPrimary.push(categoriesVisible.find(cat => cat.id === catID));
		});

		// Fill bingo list from primary pool
		// TODO: Test this logic a bit more.
		// TODO: Consider instead using while loop with two conditions - no entries left in primary pool, and still under required size.  Then could grab entry at random, and move to secondary pool if it doesn't fit
		for (const cat of catPoolPrimary) {
			if (allowSimilar || !cat.group) {
				catBingoList.push(cat);
			} else {
				if (cat.group && !usedGroups.includes(cat.group)) {
					// Allow Similar is false, and group hasn't been used yet
					catBingoList.push(cat);
					usedGroups.push(cat.group);
				}
				else {
					// Cat group already used
					catPoolSecondary.push(cat);
				}
			}

			// Filled list with randomized entries, we're done
			if (catBingoList.length >= requiredCategoryNumber) {
				break;
			}
		};

		// If we don't have enough from primary pool, fill the rest from secondary
		// These should still be roughly randomized from before
		if (catBingoList.length < requiredCategoryNumber) {
			console.warn("Filling from secondary pool");
			for (const cat of catPoolSecondary) {
				catBingoList.push(cat);

				// Filled list with randomized entries, we're done
				if (catBingoList.length === requiredCategoryNumber) {
					break;
				}
			}
		}

		// Save chosen categories to storage, and change to Bingo UI
		categories.setBingoCategories(catBingoList.map(cat => cat.id));
		setUI("bingo");
	})
}


/******************
* Set up Bingo UI *
******************/

function setupBingoUI() {
	console.log("Hello!");

	const bingoCard = document.getElementById("bingo-card");

	// TODO: Assign data attribute with size to bingo card
}



/*

let storedOutput = "";

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