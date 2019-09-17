//initalize the board
//keeps track of each square on the board
var origBoard;
const huPlayer = 'X'
const aiPlayer = 'O'
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
//stores a reference to all the cell in the html page
const cells = document.querySelectorAll('.cell')
//starts game
startGame()

//what happens when you start game
function startGame() {
  document.querySelector('.endgame').style.display = 'none'
  //load something; make the array every number from 0-9
  origBoard = Array.from(Array(9).keys())
  //to remove x & o when you restart the game
  for (let i = 0; i < cells.length; i++){
    cells[i].innerHTML = ''
    cells[i].style.removeProperty('background-color')
    cells[i].addEventListener('click', turnClick, false)
  }
}

function turnClick(square){
  //passes in the click event
  //console.log(square.target.id)
  //doesnt allow you to click on a place that has already been click
    //if number that means its a free spot
  if (typeof origBoard[square.target.id] == 'number'){

    //shows everytime you click something
    turn(square.target.id, huPlayer)
  //we want the ai player to take a turn
  //chekc if its a tie
  if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player){
  //set the board array @ the id we click to player
  origBoard[squareId] = player
  document.getElementById(squareId).innerText = player

  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player){
  //finds all the places on the board that has already been played in

  //reduce method goes through every element of the board arr and do something and give back one single value
  //initalize the acc to an empty arr
  //finds every index the player has played in
  let plays = board.reduce((a, e, i) =>
    ((e === player) ? a.concat(i) : a), [])
  let gameWon = null
  //use a for of loop
  for (let [index, win] of winCombos.entries()) {
    //win.every means go through every element of the win
      //checks if the plays is more than -1 (has the player played in every spots that counts as a win for that win )
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      //if so the player has won
      gameWon = {index: index, player: player}
      break
    }
  }
  return gameWon
  //checks if the game has won
}


function gameOver (gameWon){
  //2 for loops
  //highlight all the squares that are a part of the winning combo
  for (let index of winCombos[gameWon.index]){
    document.getElementById(index).style.backgroundColor =
    //if the humanplayer won, set background color to blue
    //if the ai player won, set thet background color to red
      gameWon.player === huPlayer ? 'blue' : 'red'
  }
  //make it so that user cannot click more squares because the game is over
  for (let i = 0; i < cells.length; i++){
    cells[i].removeEventListener('click', turnClick, false)
  }
  //when theres a gameover call the declare winner function
    //if its a humanplayer pass you win else you lose
  declareWinner(gameWon.player == huPlayer ? 'You win!' : 'You lose.')
}

function declareWinner(who){
  document.querySelector('.endgame').style.display = 'block'
  document.querySelector('.endgame .text').innerHTML = who
}

//basic ai to create a winner box
function emptySquares() {
  //filter every element in the board and see if its a number. if it is a number we are going to return it
  return origBoard.filter(s => typeof s == 'number')
}
//find a spot for the ai player to play
function bestSpot(){
  //finds the first empty square
  // use this return for easy tic tac toe
  // return emptySquares()[0]
  // use this return for hard tic tac toe
  return minmax(origBoard, aiPlayer).index
}

function checkTie(){
  //every sqaure is filled up and nobody has won
  if (emptySquares().length === 0){
    for (let i = 0; i < cells.length; i++){
      cells[i].style.backgroundColor = 'grey'
      cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner('Tie Game!')
    return true
  }
  return false
}


//min max algorithm (unbeatable ai )
// eslint-disable-next-line complexity
function minmax(newBoard, player){
  //find the index of the empty spots
  let availSpots = emptySquares()

  //checks for someone winning
  if (checkWin(newBoard, huPlayer)){
    return {score: -10}
  } else if (checkWin(newBoard, aiPlayer)){
    return {score: 10}
    //no more room to play(tie)
  } else if (availSpots.length === 0) {
    return {score: 0}
  }
  //collect the score of each of the empty spots
  let moves = []
  for (let i = 0; i < availSpots.length; i++){
    let move = {}
    move.index = newBoard[availSpots[i]]
    //set the empty spot on the board to the current player
    newBoard[availSpots[i]] = player

    if (player == aiPlayer){
      let result = minmax(newBoard, huPlayer)
      move.score = result.score
    } else {
      let result = minmax(newBoard, aiPlayer)
      move.score = result.score
    }
    //returns a score
    //resets the board and pushes the move obj to the moves arr
  newBoard[availSpots[i]] = move.index
  moves.push(move)
  }
  //chooses the move with the highest score when the ai is playing
  //chooses the move with teh lowest score when the human is playing
  var bestMove;
	if (player === aiPlayer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

