let synth;

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0);
  synth = new Tone.PolySynth().toDestination();
  synth.maxPolyphony = 10; // Limit to 5 notes
  Tone.start();
  initializeBoard();
  frameRate(3);
}

class Cell {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.newState = -1;
    this.color = null;
  }

  draw(size) {
    if (this.state == 0) {
      fill(0, 0, 0);
    } else {
      if (this.color === null) {
        this.color = color(random(255), random(255), random(255));
      }
      fill(this.color);
      ellipse(this.x * size + size / 2, this.y * size, size);
    }
    rect(this.x * size, this.y * size, size);
  }

  countLiveNeighbors() {
    let startX = Math.max(0, this.x - 1);
    let startY = Math.max(0, this.y - 1);
    let endX = Math.min(board.length, this.x + 2);
    let endY = Math.min(board[0].length, this.y + 2);

    let liveNeighbors = 0;
    for (let i = startX; i < endX; i++) {
      for (let j = startY; j < endY; j++) {
        if (!(i === this.x && j === this.y)) {
          liveNeighbors += board[i][j].state;
        }
      }
    }
    return liveNeighbors;
  }
}

let board = [];
let size = 40;
let boardsize = 10;

function initializeBoard() {
  board = [];
  for (let i = 0; i < boardsize; i++) {
    board.push([]);
    for (let j = 0; j < boardsize; j++) {
      let state = Math.round(Math.random());
      let cell = new Cell(i, j, state);
      board[i].push(cell);

      // Trigger sound for cells that start alive in the first generation
      if (state === 1) {
        if (cell.color === null) {
          cell.color = color(random(255), random(255), random(255));
        }
        let note;
        let r = red(cell.color);
        let g = green(cell.color);
        let b = blue(cell.color);

        if (r > g && r > b) {
          note = "C4";
        } else if (g > r && g > b) {
          note = "E4";
        } else if (b > r && b > g) {
          note = "G4";
        }
        synth.triggerAttackRelease(note, "8n");
      }
    }
  }
}

function calculateNewState(x, y) {
  let startX = Math.max(0, x - 1);
  let startY = Math.max(0, y - 1);
  let endX = Math.min(board.length, x + 2);
  let endY = Math.min(board[x].length, y + 2);

  let values = [];
  for (let i = startX; i < endX; i++) {
    let cells = board[i].slice(startY, endY);
    values = values.concat(cells);
  }

  let liveCells = values.filter((cell) => cell.state === 1);
  let currentState = board[x][y].state;

  if (liveCells.length === 3) {
    board[x][y].newState = 1;
  } else if (liveCells.length === 4) {
    board[x][y].newState = currentState;
  } else {
    board[x][y].newState = 0;
  }
}

function calculateLiving() {
  let flat = board.flat();
  let mapped = flat.map((cell) => cell.state);
  let livingCells = mapped.reduce((acc, cur) => acc + cur, 0);

  let livePositions = [];
  if (livingCells === 4) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].state === 1) {
          livePositions.push({ x: i, y: j });
        }
      }
    }
  }

  return livingCells === 4 ? livePositions : [];
}

function draw() {
  background(0);
  noStroke();

  let totalGridWidth = size * boardsize;
  let totalGridHeight = size * boardsize;
  let offsetX = (width - totalGridWidth) / 2;
  let offsetY = (height - totalGridHeight) / 2;

  translate(offsetX, offsetY);

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let cell = board[i][j];
      let wasDead = cell.state === 0;

      calculateNewState(i, j);

      if (
        wasDead &&
        cell.newState === 1 &&
        synth.activeVoices < synth.maxPolyphony
      ) {
        if (cell.color === null) {
          cell.color = color(random(255), random(255), random(255));
        }
        let note;
        let r = red(cell.color);
        let g = green(cell.color);
        let b = blue(cell.color);

        if (r > g && r > b) {
          note = "C4";
        } else if (g > r && g > b) {
          note = "E4";
        } else if (b > r && b > g) {
          note = "G4";
        }
        synth.triggerAttackRelease(note, "8n");
      }

      cell.draw(size);
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].state = board[i][j].newState;
    }
  }
}
