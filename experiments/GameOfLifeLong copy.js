let synth;
let isFirstGeneration = true; // Flag to track the first generation

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0);
  synth = new Tone.PolySynth().toDestination();
  synth.maxPolyphony = 100;
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
    this.hasMadeNoise = false;
  }

  draw(size) {
    if (this.state == 0) {
      fill(0, 0, 0);
      this.hasMadeNoise = false;
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

  playSoundForStateChange(newState) {
    if (isFirstGeneration) return; // Do not play any sound in the first generation

    let note;
    if (this.state === 0 && newState === 1) {
      // Cell is born
      note = "C5";
    } else if (this.state === 1 && newState === 0) {
      // Cell dies
      note = "A2";
    } else if (this.state === 1 && newState === 1) {
      // Cell remains alive
      note = "E4";
    }

    if (note) {
      synth.triggerAttackRelease(note, "8n");
    }
  }

  behaveBasedOnColor(col) {
    let r = red(col);
    let g = green(col);
    let b = blue(col);
    let liveNeighbors = this.countLiveNeighbors();

    if (liveNeighbors <= 4 && !this.hasMadeNoise && this.state === 1) {
      let note;
      if (r > g && r > b) {
        note = "C4";
      } else if (g > r && g > b) {
        note = "E4";
      } else if (b > r && b > g) {
        note = "G4";
      }
      synth.triggerAttackRelease(note, "8n");
      this.hasMadeNoise = true;
    }
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

  let newState;
  if (liveCells.length === 3) {
    newState = 1;
  } else if (liveCells.length === 4) {
    newState = currentState;
  } else {
    newState = 0;
  }

  // Play sound based on state change, excluding the first generation
  board[x][y].playSoundForStateChange(newState);

  board[x][y].newState = newState;
}

function calculateLiving() {
  let flat = board.flat();
  let mapped = flat.map((cell) => cell.state);
  let living = mapped.reduce((acc, cur) => acc + cur, 0);
  console.log(living);
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

  isFirstGeneration = false; // Mark the end of the first generation
}
