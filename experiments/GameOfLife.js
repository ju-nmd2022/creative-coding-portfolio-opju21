function setup() {
  createCanvas(innerWidth, innerHeight);
}

class Cell {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.newState = -1;
  }

  draw(size) {
    if (this.state == 0) {
      fill(0, 0, 0);
    } else {
      fill(random(255), random(255), random(255));
      ellipse(this.x * size + size / 2, this.y * size - size, size);
      ellipse(this.x * size + size / 2, this.y * size, size);
    }

    rect(this.x * size, this.y * size, size);
  }
}

let board = [];
let size = 10;
let lifecycle = 2;
let count = 0;
let boardsize = 200;

for (let i = 0; i < boardsize; i++) {
  board.push([]);
  for (let j = 0; j < boardsize; j++) {
    let state = Math.round(Math.random() % 1);
    let cell = new Cell(i, j, state);
    board[i].push(cell);
  }
}

function calculateNewState(x, y) {
  // count neighbour cells
  let startX = Math.max(0, x - 1);
  let startY = Math.max(0, y - 1);
  let endX = Math.min(board.length, x + 2);
  let endY = Math.min(board[x].length, y + 2);

  let values = [];
  for (let i = startX; i < endX; i++) {
    let cells = board[i].slice(startY, endY);
    values = values.concat(cells);
  }
  // filter for 1/0
  let liveCells = values.filter((cell) => cell.state === 1);
  let currentState = board[x][y].state;
  if (liveCells.length === 3) {
    board[x][y].newState = 1;
  } else if (liveCells.length === 4) {
    board[x][y].newState = currentState;
  } else {
    board[x][y].newState = 0;
  }
  // 2 = 0
  // 4 = same
  // 3 = 1
  // >5 = 0
}

function calculateLiving() {
  let flat = board.flat();
  let mapped = flat.map((cell) => cell.state);
  let living = mapped.reduce((acc, cur) => acc + cur);
  console.log(living);
}

function draw() {
  if (count == 0) {
    noStroke();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].draw(size);
        calculateNewState(i, j);
      }
    }
    calculateLiving();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].state = board[i][j].newState;
      }
    }
  }
  count++;
  if (count == lifecycle) {
    count = 0;
  }
}

/*
Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
