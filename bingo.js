"use strict"

const rows = 5;
const cols = 5;
let availableList = [
	"test1",
	"test2",
	"test3",
	"test3",
	"test4",
	"test5",
	"test6",
	"test7",
	"test8",
	"test9",
	"test10",
	"test11",
	"test12",
	"test13",
	"test13",
	"test14",
	"test15",
	"test16",
	"test17",
	"test18",
	"test19",
	"test20",
	"test21",
	"test22",
	"test23",
	"test23",
	"test24",
	"test25",
	"test26",
	"test27",
	"test28",
	"test29",
	"test30"
];

let selectedList = [];
const bingoText = document.getElementById("bingo-text");

// Get random selection of bingo entries
for (let i=0; i<rows*cols; i++) {
	let selectedIndex = Math.floor(Math.random() * availableList.length);
	selectedList.push(availableList[selectedIndex]);
	availableList.splice(selectedIndex, 1);
}

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

// Add rows
let colCount = 0;
selectedList.forEach(val => {
	output += "|" + val;
	colCount++;
	if (colCount === cols) {
		output += "|\n";
		colCount = 0;
	}
});

// Add output to text field
bingoText.innerHTML = output;
