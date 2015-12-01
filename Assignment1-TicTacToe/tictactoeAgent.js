/*
	Duy Huynh
	TCSS 435
	Fall 2015
	Tic Tac Toe

*/

// Attempt at Minimax below...

var Agent = function() {

};

// Agent that uses minimax
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

    return this.minimax(board);
};

// Evaluation function
Agent.prototype.evaluate = function(board) {
	if (board.gameOver()===1) {
		return 10; // player X  won
	} else if (board.gameOver() === 2) {
		return -10; // opponent O won
	} else if (board.gameOver() === 3) {
		return 0; // a draw
	}
};

Agent.prototype.minimax = function(board) {

	var that = this;
	// Base case: A game-over, return minimax value
	if (board.gameOver() !== 0) {
        return this.evaluate(board);
	}

	// Otherwise keep a tally of the scores and moves
	var results = [];
	var moves = [];

	// For each available move, run minimax recursively
    for (var i = 0; i<10; i++) {
        if(clonedBoard.cellFree(i)) {
            var clonedBoard = board.clone();
            console.log(i);
            clonedBoard.move(i);
            results.push(that.minimax(clonedBoard));
            moves.push(i);
        }
    }

	// Find max or min depending on turn order
	if (board.playerOne) {
		var maxScoreIndex = results.indexOf(Math.max.apply(Math, results));
		var move = moves[maxScoreIndex];
		console.log("MAX MOVE: " + move);
		return results[maxScoreIndex];
	} else {
		// Player O goes second, so MINIMIZED score
		var minScoreIndex = results.indexOf(Math.min.apply(Math, results));
		var move = moves[minScoreIndex];
		console.log("MIN MOVE: " + move);
		return results[minScoreIndex];
	}

};