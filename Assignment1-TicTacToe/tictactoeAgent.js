/*
	Duy Huynh
	TCSS 435
	Fall 2015
	Tic Tac Toe

	I implemented simple rule-of-thumbs in the program to play
	Tic-Tac-Toe. For example, always go for the middle if possible,
	then corners. But always win if possible as a priority, then 
	block before trying anything else.

	I tried to implement minimax as an exercise afterwards but I could
	not exactly figure out the bugs in the code. I left the functions
	for the minimax in the code for a later date.
*/
var Agent = function() {

}

var Agent2 = function() {

}

// "Dumb" practice agent that just plays randomly.
Agent2.prototype.selectMove = function(board) {

	// Array of moves that are available
	var freeCells = []; // Array of free cells
	for (var i = 1; i < 10; i++) {
		if (board.cellFree(i)) freeCells.push(i);
	}

	return move = freeCells[Math.floor(Math.random() * freeCells.length)];
}

// Agent that uses simple hard-coded heuristics of Tic-Tac-Toe to play. 
Agent.prototype.selectMove = function(board) {

	// X's array of values: board.X
	// O's array of values: board.O
	// To get whether a cell is X or Y, do board.cells[i].className

	/*
		-------------	
		| 8 | 1 | 6 |	To get the value of a cell (X or O),
		-------------	subtract 1 from the value of the
		| 3 | 5 | 7 |	magic square numbers to get that cell.
		-------------	Then call board.cells[i].className
		| 4 | 9 | 2 |	where i is that value. Nothing is empty string.
		-------------
	*/

	var move; // The selected move

	// Array of moves that are available
	var freeCells = []; // Array of free cells
	for (var i = 1; i < 10; i++) {
		if (board.cellFree(i)) freeCells.push(i);
	}

	// Always pick the middle if available.
	if (this.takeMiddle(freeCells)) {
		move = 5;
	}

	// If middle was unavailable, then block or win
	if (move === undefined) {
		var xPairs = this.getPairs(board.X)
		var oPairs = this.getPairs(board.O)

		// I went first! I'm X?
		move = board.X.length === board.O.length ? this.blockOrWin(xPairs, oPairs, freeCells) : this.blockOrWin(oPairs, xPairs, freeCells);
	}

	// Take a corner if no blocking/winning needed
	if (move === undefined) {
		move = this.takeCorner(freeCells);
	}

	// If at this point there is no obivious move, take a corner
	if (move === undefined) {
		move = freeCells[Math.floor(Math.random() * freeCells.length)];
	}

	// console.log("X: " + board.X)
	// console.log("O: " + board.O)
	return move;

}

// Grab an empty corner.
Agent.prototype.takeCorner = function(available) {
	var self = this;
	var corners = [2, 4, 6, 8];
	var availableCorners = available.filter(function(n) {
		return corners.indexOf(n) != -1;
	});
	// console.log("Corners available: " + availableCorners)
	return availableCorners[Math.floor(Math.random() * availableCorners.length)];
}

// Always shoot for the middle.
Agent.prototype.takeMiddle = function(available) {
	return available.indexOf(5) != -1;
}

// Returns an array of unique pairs given an array of elements
Agent.prototype.getPairs = function(array) {
	var pairs = [];
	for (var i = 0; i < array.length - 1; i++) {
		for (var j = i + 1; j < array.length; j++) {
			pairs.push([array[i], array[j]]);
		}
	}
	return pairs;
}

// Attempt to win if possible, otherwise block opponent
Agent.prototype.blockOrWin = function(myPairs, theirPairs, available) {
	var self = this;
	var returnValue = this.twoInRow(myPairs, available);
	if (returnValue === undefined) {
		return self.twoInRow(theirPairs, available);
	}
	return returnValue;
}

// Detect two-in-a-rows for potential wins or blocks.
Agent.prototype.twoInRow = function(pairs, available) {
	var self = this;
	var returnValue;
	pairs.forEach(function(pair) {
		var value = 15 - (pair[0] + pair[1]);
		if (available.indexOf(value) != -1) {
			returnValue = value;
		}
	})
	return returnValue
}