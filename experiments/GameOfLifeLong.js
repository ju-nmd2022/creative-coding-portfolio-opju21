let synth;

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0);
  synth = new Tone.PolySynth().toDestination(); // Initialize the synthesizer
  synth.maxPolyphony = 100;
  Tone.start(); // Start Tone.js audio context
  initializeBoard(); // Initialize the board for the first time

  frameRate(3); // Set the frame rate to 5 frames per second
}

class Cell {
  constructor(x, y, state) {
    this.x = x; // The x-coordinate of the cell in the grid
    this.y = y; // The y-coordinate of the cell in the grid
    this.state = state; // The current state of the cell (0 = dead, 1 = alive)
    this.newState = -1; // Placeholder for the new state in the next generation
    this.color = null; // The color of the cell (will be assigned later if alive)
    this.hasMadeNoise = false; // Ensure the noise is triggered only once when the color is active
  }

  draw(size) {
    if (this.state == 0) {
      fill(0, 0, 0); // Fill black for dead cells
      this.hasMadeNoise = false; // Reset the noise trigger when the cell is dead
    } else {
      if (this.color === null) {
        // If the cell is alive but has no color yet, assign a random color
        this.color = color(random(255), random(255), random(255));
      }
      fill(this.color); // Use the assigned color to fill the cell
      ellipse(this.x * size + size / 2, this.y * size, size); // Draw the cell as an ellipse in the grid

      // Check the color and trigger sound based on color components
      this.behaveBasedOnColor(this.color);
    }

    rect(this.x * size, this.y * size, size); // Draw the grid cell as a rectangle
  }

  // Calculate how many live neighbors this cell has
  countLiveNeighbors() {
    let startX = Math.max(0, this.x - 1); // Ensure bounds are valid
    let startY = Math.max(0, this.y - 1);
    let endX = Math.min(board.length, this.x + 2); // Limit to board size
    let endY = Math.min(board[0].length, this.y + 2);

    let liveNeighbors = 0;
    for (let i = startX; i < endX; i++) {
      for (let j = startY; j < endY; j++) {
        if (!(i === this.x && j === this.y)) {
          // Don't count itself
          liveNeighbors += board[i][j].state;
        }
      }
    }
    return liveNeighbors;
  }

  // Trigger sound based on the cell's color and the number of live neighbors
  behaveBasedOnColor(col) {
    let r = red(col); // Get the red component of the cell's color
    let g = green(col); // Get the green component
    let b = blue(col); // Get the blue component

    let liveNeighbors = this.countLiveNeighbors(); // Count the number of live neighbors

    // Only play sound if the cell has 4 or fewer living neighbors
    if (liveNeighbors <= 4 && !this.hasMadeNoise && this.state === 1) {
      let note;
      if (r > g && r > b) {
        note = "C4"; // Red-dominant color plays C4
      } else if (g > r && g > b) {
        note = "E4"; // Green-dominant color plays E4
      } else if (b > r && b > g) {
        note = "G4"; // Blue-dominant color plays G4
      }

      // Trigger the note and mark that sound has been made for this cell
      synth.triggerAttackRelease(note, "8n");
      this.hasMadeNoise = true;
    }
  }
}

let board = []; // 2D array to represent the grid of cells
let size = 40; // Size of each cell in the grid
let boardsize = 10;

// Initialize the board with cells
function initializeBoard() {
  board = []; // Reset the board
  for (let i = 0; i < boardsize; i++) {
    board.push([]); // Add a new row to the board
    for (let j = 0; j < boardsize; j++) {
      let state = Math.round(Math.random()); // Randomly assign state (0 or 1) to each cell
      let cell = new Cell(i, j, state); // Create a new Cell object
      board[i].push(cell); // Add the cell to the board
    }
  }
}

function calculateNewState(x, y) {
  // Determine the range of neighbor cells
  let startX = Math.max(0, x - 1); // Make sure not to go out of bounds
  let startY = Math.max(0, y - 1); // Same for Y
  let endX = Math.min(board.length, x + 2); // Limit the range to the grid size
  let endY = Math.min(board[x].length, y + 2); // Same for Y

  let values = []; // Array to store neighboring cells
  for (let i = startX; i < endX; i++) {
    let cells = board[i].slice(startY, endY); // Get the neighboring cells
    values = values.concat(cells); // Add them to the list
  }

  // Count the number of live cells among the neighbors
  let liveCells = values.filter((cell) => cell.state === 1);
  let currentState = board[x][y].state; // Get the current state of the cell

  // Apply the rules of the Game of Life
  if (liveCells.length === 3) {
    board[x][y].newState = 1; // Cell becomes alive if exactly 3 neighbors are alive
  } else if (liveCells.length === 4) {
    board[x][y].newState = currentState; // Cell retains its current state if 4 neighbors are alive
  } else {
    board[x][y].newState = 0; // Cell dies in all other cases
  }
}

function calculateLiving() {
  let flat = board.flat(); // Flatten the 2D array of cells into a 1D array
  let mapped = flat.map((cell) => cell.state); // Map each cell to its state (0 or 1)
  let living = mapped.reduce((acc, cur) => acc + cur, 0); // Sum up the living cells (where state is 1)
  console.log(living); // Log the number of living cells
}

function draw() {
  background(0); // Clear the background each frame
  noStroke(); // Disable stroke for shapes

  // Calculate total grid size in pixels
  let totalGridWidth = size * boardsize;
  let totalGridHeight = size * boardsize;

  // Calculate the offset to center the grid
  let offsetX = (width - totalGridWidth) / 2;
  let offsetY = (height - totalGridHeight) / 2;

  // Translate the canvas so the grid is centered
  translate(offsetX, offsetY);

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].draw(size); // Draw each cell
      calculateNewState(i, j); // Calculate the new state for the next generation
    }
  }

  calculateLiving(); // Calculate the number of living cells

  // Update the state of the board to the new state
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].state = board[i][j].newState;
    }
  }
}
