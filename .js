const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const modeSelect = document.getElementById('modeSelect');
const gameContainer = document.getElementById('game');

let cells = [];
let currentPlayer = 'X';
let gameMode = 'friend';
let gameOver = false;

function startGame(mode) {
  gameMode = mode;
  modeSelect.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  initBoard();
}

function initBoard() {
  board.innerHTML = '';
  cells = [];
  currentPlayer = 'X';
  gameOver = false;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => handleMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleMove(index) {
  if (cells[index].textContent !== '' || gameOver) return;

  cells[index].textContent = currentPlayer;
  let winner = checkWinner();

  if (winner) {
    endGame(winner);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (gameMode === 'ai' && currentPlayer === 'O' && !gameOver) {
    setTimeout(() => {
      aiMove();
    }, 500);
  }
}

function aiMove() {
  // Simple AI: random move
  let emptyIndices = cells
    .map((cell, i) => cell.textContent === '' ? i : null)
    .filter(i => i !== null);

  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  handleMove(randomIndex);
}

function checkWinner() {
  const combos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let combo of combos) {
    const [a, b, c] = combo;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[b].textContent === cells[c].textContent
    ) {
      cells[a].classList.add('win');
      cells[b].classList.add('win');
      cells[c].classList.add('win');
      return cells[a].textContent;
    }
  }

  if (cells.every(cell => cell.textContent)) {
    return 'Draw';
  }

  return null;
}

function endGame(result) {
  gameOver = true;
  if (result === 'Draw') {
    statusText.textContent = "It's a Draw!";
  } else {
    statusText.textContent = `Player ${result} Wins!`;
  }
}

resetBtn.addEventListener('click', () => {
  gameContainer.classList.add('hidden');
  modeSelect.classList.remove('hidden');
});
