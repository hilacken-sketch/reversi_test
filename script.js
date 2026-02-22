const SIZE = 8;
let board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let currentPlayer = 1; // 1=黒, 2=白

const directions = [
  [-1,-1], [-1,0], [-1,1],
  [0,-1],          [0,1],
  [1,-1],  [1,0],  [1,1]
];

board[3][3] = 2;
board[3][4] = 1;
board[4][3] = 1;
board[4][4] = 2;

function render() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.onclick = () => handleClick(y, x);

      if (board[y][x] !== 0) {
        const stone = document.createElement("div");
        stone.className = "stone " + (board[y][x] === 1 ? "black" : "white");
        cell.appendChild(stone);
      }

      boardDiv.appendChild(cell);
    }
  }
}

function isValidMove(y, x, player) {
  if (board[y][x] !== 0) return false;

  const opponent = player === 1 ? 2 : 1;

  for (let [dy, dx] of directions) {
    let ny = y + dy;
    let nx = x + dx;
    let foundOpponent = false;

    while (ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE) {
      if (board[ny][nx] === opponent) {
        foundOpponent = true;
      } else if (board[ny][nx] === player) {
        if (foundOpponent) return true;
        break;
      } else {
        break;
      }
      ny += dy;
      nx += dx;
    }
  }

  return false;
}

function flipStones(y, x, player) {
  const opponent = player === 1 ? 2 : 1;

  for (let [dy, dx] of directions) {
    let ny = y + dy;
    let nx = x + dx;
    let stonesToFlip = [];

    while (ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE) {
      if (board[ny][nx] === opponent) {
        stonesToFlip.push([ny, nx]);
      } else if (board[ny][nx] === player) {
        stonesToFlip.forEach(([fy, fx]) => {
          board[fy][fx] = player;
        });
        break;
      } else {
        break;
      }
      ny += dy;
      nx += dx;
    }
  }
}

function handleClick(y, x) {
  if (!isValidMove(y, x, currentPlayer)) return;

  board[y][x] = currentPlayer;
  flipStones(y, x, currentPlayer);
  currentPlayer = currentPlayer === 1 ? 2 : 1;

  render();
}

const WEIGHTS = [
 [100,-20,10,5,5,10,-20,100],
 [-20,-50,-2,-2,-2,-2,-50,-20],
 [10,-2,5,1,1,5,-2,10],
 [5,-2,1,0,0,1,-2,5],
 [5,-2,1,0,0,1,-2,5],
 [10,-2,5,1,1,5,-2,10],
 [-20,-50,-2,-2,-2,-2,-50,-20],
 [100,-20,10,5,5,10,-20,100]
];

function evaluate(board, player) {
  let score = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (board[y][x] === player) score += WEIGHTS[y][x];
      if (board[y][x] !== 0 && board[y][x] !== player) score -= WEIGHTS[y][x];
    }
  }
  return score;
}

render();
