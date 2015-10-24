// Tic Tac Toe
var Agent = function() {

}

var Agent2 = function() {

}

Agent2.prototype.selectMove = function(board) {

	// Array of moves that are available
	var freeCells = []; // Array of free cells
	for (var i = 1; i < 10; i++) {
		if (board.cellFree(i)) freeCells.push(i);
	}

	return move = freeCells[Math.floor(Math.random() * freeCells.length)];
}



Agent.prototype.selectMove = function(board) {

	/* 
		1. Pick middle regardless of the move or turn order. It's optimal.
	 	2. Then if 
	*/
	var move; // The selected move

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



	// Array of moves that are available
	var freeCells = []; // Array of free cells
	for (var i = 1; i < 10; i++) {
		if (board.cellFree(i)) freeCells.push(i);
	}

	// Always pick the middle if available.
	if (this.takeMiddle(freeCells)) {
		move = 5;
	} else {
		// Check pairs and block or win
		var xPairs = this.getPairs(board.X)
		var oPairs = this.getPairs(board.O)
		move = board.playerOne ? this.blockOrWin(xPairs, oPairs, freeCells) : this.blockOrWin(oPairs, xPairs, freeCells);
		console.log("What is move?: " + move)
		console.log(move == null)
	}



	if (move === undefined) move = freeCells[Math.floor(Math.random() * freeCells.length)];

	console.log("" + board.playerOne + " plays " + move)
	console.log("X: " + board.X)
	console.log("O: " + board.O)
	console.log("End my turn")
	return move;

}

Agent.prototype.takeCorner = function(available) {
	var self = this;
	var returnCorner;
	var corners = [8, 6, 4, 2];
	corners.forEach(function(corner) {
		if (self.inArray(available, corner)) {
			self.returnCorner = corner;
			console.log("Corner found!: " + self.returnCorner)
		}
	})
	console.log("COrner: " + returnCorner)
	return self.returnCorner;
}

Agent.prototype.takeMiddle = function(available) {
	return this.inArray(available, 5);
}

// Checks to see if a spot exists in an array
Agent.prototype.inArray = function(array, value) {
	var present = false;
	for (var i = 1; i < 10; i++) {
		if (array[i] == value) {
			present = true;
		}
	}
	return present;
};

// Returns an array of unique pairs given an array of elements
Agent.prototype.getPairs = function(array) {
	var pairs = [];
	for (var i = 0; i < array.length - 1; i++) {
		for (var j = i + 1; j < array.length; j++) {
			pairs.push([array[i], array[j]]);
		}
	}
	// How to iterate through the array of pairs:
	// this.getPairs(freeCells).forEach(function(element){
	// 		console.log("" + element[0] + ", " + element[1])
	// 	});

	// BOOK: page 164, 166
	return pairs;
}

Agent.prototype.blockOrWin = function(myPairs, theirPairs, available) {
	var self = this;
	var returnValue = this.twoInRow(myPairs, available);
	if (returnValue == null) {
		return self.twoInRow(theirPairs, available);
		console.log("Their pair: " + theirPairs)
	}
	return returnValue;

}

Agent.prototype.twoInRow = function(pairs, available) {
	var self = this;
	var returnValue;
	pairs.forEach(function(pair) {
		console.log("Pairs: " + pair[0] + ", " + pair[1])
		var value = 15 - (pair[0] + pair[1]);
		if (self.inArray(available, value)) {
			returnValue = value;
			console.log("Return value: " + returnValue)
		}
	})
	return returnValue
}

Agent.prototype.result = function(board) {
	if (board.gameOver === 1) {
		return 10; // player won
	} else if (board.gameOver === 2) {
		return -10; // opponent won
	} else {
		return 0; // a draw
	}
}