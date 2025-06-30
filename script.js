const buttons = [];
let currentPlayer = "X"; // Default to human starting
let gameActive = true;

// Initialize game
function init() {
  gameActive = true;
  document.getElementById("status").textContent = "Your turn (X)";
  const container = document.getElementById("game-buttons");
  container.innerHTML = ""; // Clear existing buttons

  for (let i = 0; i < 3; i++) {
    buttons[i] = [];
    for (let j = 0; j < 3; j++) {
      const btn = document.createElement("button");
      btn.textContent = "";
      btn.disabled = false;
      btn.dataset.row = i;
      btn.dataset.col = j;
      btn.addEventListener("click", handleClick);
      container.appendChild(btn);
      buttons[i][j] = btn;
    }
  }

  currentPlayer = Math.random() < 0.5 ? "X" : "O"; // Randomly decide who starts

  if (currentPlayer === "O") {
    document.getElementById("status").textContent = "Computer starts!";
    disableButtons();
    setTimeout(() => {
      computerMove();
      currentPlayer = "X";
      enableButtons();
      document.getElementById("status").textContent = "Your turn (X)";
    }, 500);
  } else {
    enableButtons();
  }
}

// Handle human click
function handleClick(e) {
  if (!gameActive || currentPlayer !== "X") return;
  const row = e.target.dataset.row;
  const col = e.target.dataset.col;
  if (buttons[row][col].textContent !== "") return;

  makeMove(row, col, "X");
  if (checkWin("X")) {
    document.getElementById("status").textContent = "You win!";
    endGame();
    return;
  }
  if (checkDraw()) {
    document.getElementById("status").textContent = "It's a draw!";
    endGame();
    return;
  }

  currentPlayer = "O";
  disableButtons();
  document.getElementById("status").textContent = "Computer's turn...";
  setTimeout(computerMove, 500);
}

// Computer makes a random move
function computerMove() {
  const empty = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (buttons[i][j].textContent === "") {
        empty.push({ row: i, col: j });
      }
    }
  }
  if (empty.length === 0) return;

  const move = empty[Math.floor(Math.random() * empty.length)];
  makeMove(move.row, move.col, "O");

  if (checkWin("O")) {
    document.getElementById("status").textContent = "Computer wins!";
    endGame();
    return;
  }
  if (checkDraw()) {
    document.getElementById("status").textContent = "It's a draw!";
    endGame();
    return;
  }

  currentPlayer = "X";
  enableButtons();
  document.getElementById("status").textContent = "Your turn (X)";
}

// Make a move
function makeMove(row, col, player) {
  buttons[row][col].textContent = player;
}

// Check for a winner
function checkWin(player) {
  for (let i = 0; i < 3; i++) {
    if (buttons[i][0].textContent === player && buttons[i][1].textContent === player && buttons[i][2].textContent === player) return true;
    if (buttons[0][i].textContent === player && buttons[1][i].textContent === player && buttons[2][i].textContent === player) return true;
  }
  if (buttons[0][0].textContent === player && buttons[1][1].textContent === player && buttons[2][2].textContent === player) return true;
  if (buttons[0][2].textContent === player && buttons[1][1].textContent === player && buttons[2][0].textContent === player) return true;

  return false;
}

// Check for draw
function checkDraw() {
  return buttons.flat().every(btn => btn.textContent !== "");
}

// End game (disable moves)
function endGame() {
  gameActive = false;
  disableButtons();
}

// Enable all buttons
function enableButtons() {
  for (const row of buttons) {
    for (const btn of row) {
      btn.disabled = false;
    }
  }
}

// Disable all buttons
function disableButtons() {
  for (const row of buttons) {
    for (const btn of row) {
      btn.disabled = true;
    }
  }
}

// Initialize game when page loads
init();

// Connect restart button to re-initialize the game
document.getElementById("restart").addEventListener("click", () => {
  init();
});
