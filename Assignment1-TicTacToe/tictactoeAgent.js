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

	// (array of possible moves, initial depth, maximizing player?)
	return this.minimax(board, 0, true);

}

// Attempt at Minimax below...

Agent.prototype.score = function(board, depth) {
	if (board.gameOver === 1) {
		return 10 - depth; // player won
	} else if (board.gameOver === 2) {
		return depth - 10; // opponent won
	} else if (board.gameOver === 3) {
		return 0; // a draw
	} else return 0; // Not end game yet
}


Agent.prototype.minimax = function(board, depth, maximizingPlayer) {


	var freeCells = [];
	for (var i = 1; i < 10; i++) {
		if (board.cellFree(i)) freeCells.push(i);
	}
	console.log(freeCells);

	var that = this;
	// Base case: A game-over, return minimax value
	// Win: 1, Loss: -1, Draw: 0.
	if (board.gameOver === 0) {
		return this.score(board, depth);
	}


	// Otherwise keep a tally of the scores and moves
	var results = [];
	var moves = [];

	var newBoard = board;
	newBoard.clone;
	// For each available move, run minimax recursively
	freeCells.forEach(function(cell) {
		// Clone then seed board with a possible move
		newBoard.move(cell);
		// Push the outcome to a list of results
		results.push(that.minimax(newBoard, depth + 1, true ));
		// Track the moves in array
		moves.push(cell);
	})

	// Player X was first, so get MAXIMIZED score
	if (maximizingPlayer) {
		var maxScoreIndex = results.indexOf(Math.max.apply(null, results));
		move = moves[maxScoreIndex];
		console.log("MAX MOVE: " + move)
		return results[maxScoreIndex];
	} else {
		// Player O goes second, so MINIMIZED score
		var minScoreIndex = results.indexOf(Math.min.apply(null, results));
		move = moves[minScoreIndex];
		console.log("MIN MOVE: " + move)
		return results[minScoreIndex];
	}

}
