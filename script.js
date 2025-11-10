// --- DOM Elements ---
const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const playerChoiceModal = document.getElementById("player-choice-modal");
const chooseXBtn = document.getElementById("choose-x");
const chooseOBtn = document.getElementById("choose-o");
const endGameModal = document.getElementById("end-game-modal");
const endGameMessage = document.getElementById("end-game-message");
const turnIndicator = document.getElementById("turn-indicator");

// --- Game State ---
let boardState = ["", "", "", "", "", "", "", "", ""];
let humanPlayer = "";
let aiPlayer = "";
let currentPlayer = "";
let gameActive = false;

const winningCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8], // Rows
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8], // Columns
	[0, 4, 8],
	[2, 4, 6], // Diagonals
];

// --- Event Listeners ---
chooseXBtn.addEventListener("click", () => startGame("X"));
chooseOBtn.addEventListener("click", () => startGame("O"));

cells.forEach((cell) => {
	cell.addEventListener("click", handleCellClick);
});

// --- Game Flow Functions ---

function startGame(playerChoice) {
	humanPlayer = playerChoice;
	aiPlayer = playerChoice === "X" ? "O" : "X";
	currentPlayer = "X";

	playerChoiceModal.classList.add("hidden");
	resetBoard();

	if (humanPlayer === "O") {
		turnIndicator.textContent = `Computer's turn (${aiPlayer})`;
		gameActive = true;
		setTimeout(aiMove, 700);
	} else {
		turnIndicator.textContent = `Your turn! (${humanPlayer})`;
		gameActive = true;
	}
}

function handleCellClick(e) {
	const index = e.target.dataset.index;

	if (boardState[index] !== "" || !gameActive || currentPlayer === aiPlayer) {
		return;
	}

	placeMark(index, humanPlayer);

	if (checkWin(humanPlayer)) {
		endGame(false, humanPlayer);
		return;
	}
	if (checkDraw()) {
		endGame(true);
		return;
	}

	switchPlayer(aiPlayer);
	setTimeout(aiMove, 700);
}

function aiMove() {
	if (!gameActive) return;

	const move = findBestMove();

	placeMark(move, aiPlayer);

	if (checkWin(aiPlayer)) {
		endGame(false, aiPlayer);
		return;
	}
	if (checkDraw()) {
		endGame(true);
		return;
	}

	switchPlayer(humanPlayer);
}

function endGame(isDraw, winner = null) {
	gameActive = false;

	if (isDraw) {
		endGameMessage.textContent = "It's a Draw!";
	} else {
		endGameMessage.textContent =
			winner === humanPlayer ? "You Win!" : "Computer Wins!";
	}

	endGameModal.classList.remove("hidden");

	setTimeout(() => {
		endGameModal.classList.add("hidden");
		playerChoiceModal.classList.remove("hidden");
		resetBoard();
	}, 2000);
}

// --- Helper Functions ---
function placeMark(index, player) {
	boardState[index] = player;
	const cell = cells[index];
	cell.textContent = player;
	cell.classList.add(player.toLowerCase());
}

function switchPlayer(nextPlayer) {
	currentPlayer = nextPlayer;
	turnIndicator.textContent =
		currentPlayer === humanPlayer
			? `Your turn! (${humanPlayer})`
			: `Computer's turn (${aiPlayer})`;
}

function checkWin(player) {
	return winningCombos.some((combo) => {
		return combo.every((index) => boardState[index] === player);
	});
}

function checkDraw() {
	return boardState.every((cell) => cell !== "");
}

function resetBoard() {
	boardState = ["", "", "", "", "", "", "", "", ""];
	cells.forEach((cell) => {
		cell.textContent = "";
		cell.classList.remove("x", "o");
	});
	turnIndicator.textContent = "";
}

// --- 6. AI Logic (Rule-based) ---
function findBestMove() {
	let winningMove = findWinningMove(aiPlayer);
	if (winningMove !== -1) return winningMove;

	let blockingMove = findWinningMove(humanPlayer);
	if (blockingMove !== -1) return blockingMove;

	if (boardState[4] === "") return 4;

	let availableSpots = [];
	boardState.forEach((val, index) => {
		if (val === "") availableSpots.push(index);
	});

	const randomIndex = Math.floor(Math.random() * availableSpots.length);
	return availableSpots[randomIndex];
}

function findWinningMove(player) {
	for (let i = 0; i < boardState.length; i++) {
		if (boardState[i] === "") {
			boardState[i] = player;
			if (checkWin(player)) {
				boardState[i] = "";
				return i;
			}
			boardState[i] = "";
		}
	}
	return -1;
}
