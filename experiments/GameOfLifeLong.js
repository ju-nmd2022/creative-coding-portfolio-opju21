import * as Tone from "tone";
let synth;

function setup() {
  fill(0, 0, 0);
  createCanvas(innerWidth, innerHeight); // Creates a canvas that fills the browser window

  synth = new Tone.Synth().toDestination(); // Initializes a new synthesizer and connects it to the destination (output speakers)
  Tone.start(); // Ensures that Tone.js is initialized and ready to produce sound
}

class Cell {
  constructor(x, y, state) {
    this.x = x; // The x-coordinate of the cell in the grid
    this.y = y; // The y-coordinate of the cell in the grid
    this.state = state; // The current state of the cell (0 = dead, 1 = alive)
    this.newState = -1; // Placeholder for the new state in the next generation
    this.color = null; // The color of the cell (will be assigned later if alive)
    this.hasMadeNoise = false; // Boolean flag to ensure the sound is triggered only once when the cell turns blue
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

      // Check the color and trigger sound if it's predominantly blue
      this.behaveBasedOnColor(this.color);
    }

    rect(this.x * size, this.y * size, size); // Draw the grid cell as a rectangle
  }

  behaveBasedOnColor(col) {
    let b = blue(col); // Get the blue component of the cell's color

    // If the blue component is greater than 110 and the cell hasn't made noise yet, trigger sound
    if (b > 110 && !this.hasMadeNoise) {
      synth.triggerAttackRelease("C4", "2n"); // Play a C4 note for an eighth note duration
      this.hasMadeNoise = true; // Mark that the cell has made noise so it won't repeat
    }
  }
}

let board = []; // 2D array to represent the grid of cells
let size = 10; // Size of each cell in the grid
let lifecycle = 5; // Number of frames between state updates
let count = 0; // Counter to keep track of frames
let boardsize = 200; // Number of cells in each dimension of the grid (200x200)

// Initialize the board with cells
for (let i = 0; i < boardsize; i++) {
  board.push([]); // Add a new row to the board
  for (let j = 0; j < boardsize; j++) {
    let state = Math.round(Math.random() % 1); // Randomly assign state (0 or 1) to each cell
    let cell = new Cell(i, j, state); // Create a new Cell object
    board[i].push(cell); // Add the cell to the board
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
  if (count == 0) {
    noStroke(); // Disable stroke for shapes
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
  count++; // Increment the frame counter
  if (count == lifecycle) {
    count = 0; // Reset the frame counter after completing one lifecycle
  }
}

// Add a mousePressed function to trigger Tone.js correctly
function mousePressed() {
  if (Tone.context.state !== "running") {
    Tone.context.resume(); // Ensure Tone.js is started when the mouse is pressed (needed in some browsers)
  }
}
