let ballX;
let ballY;
let xspeed;
let yspeed;
let r = 20;
let size = 50; // Size of each grid cell
let gap = 50; // Gap between grid cells
let cols, rows;
let synth;
let note;
let grid = []; // Array to store the grid and each square's properties
let mousedCLK = false;

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0);

  // Calculate the number of columns and rows based on the canvas size
  cols = Math.floor(width / (size + gap)); // Number of columns in the grid
  rows = Math.floor(height / (size + gap)); // Number of rows in the grid

  synth = new Tone.PolySynth().toDestination(); // Initialize the synthesizer
  synth.maxPolyphony = 100;
  Tone.start(); // Start Tone.js audio context

  // Initialize the grid and each square's properties
  for (let col = 0; col < cols; col++) {
    grid[col] = [];
    for (let row = 0; row < rows; row++) {
      grid[col][row] = { hasMadeNoise: false }; // Each square starts with no sound made
    }
  }
}

function draw() {
  background(0);

  // Draw grid
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const xPosition = col * (size + gap);
      const yPosition = row * (size + gap);
      fill(255);
      rect(xPosition, yPosition, size, size); // Draw each cell in the grid

      // Check for ball collision with the current square
      if (isBallCollidingWithSquare(xPosition, yPosition, size)) {
        fill(random(255), random(255), random(255)); // Change the color of the square if a collision occurs
        rect(xPosition, yPosition, size, size);

        if (!grid[col][row].hasMadeNoise) {
          // Trigger sound only if it hasn't been played for this square
          note = "C4"; // You can change this to generate different notes
          synth.triggerAttackRelease(note, "8n");
          grid[col][row].hasMadeNoise = true; // Mark that this square has made a noise
        }
      } else {
        // Reset the `hasMadeNoise` flag when the ball is no longer colliding with the square
        grid[col][row].hasMadeNoise = false;
      }
    }
  }

  // Move the ball if it has been initialized
  if (ballX !== undefined && ballY !== undefined) {
    moveBall();
    drawBall();
  }
}

// Function to check if the ball is colliding with a square
function isBallCollidingWithSquare(xPos, yPos, squareSize) {
  // Check if the ball's center is inside the square's boundaries
  return (
    ballX + r > xPos && // Ball's right side is past the square's left side
    ballX - r < xPos + squareSize && // Ball's left side is before the square's right side
    ballY + r > yPos && // Ball's bottom is past the square's top side
    ballY - r < yPos + squareSize // Ball's top is before the square's bottom side
  );
}

// Function to move the ball and handle edge collision
function moveBall() {
  ballX += xspeed;
  ballY += yspeed;

  // Check for collisions with canvas edges and reverse speed if needed
  if (ballX > width - r || ballX < r) {
    xspeed = -xspeed;
  }
  if (ballY > height - r || ballY < r) {
    yspeed = -yspeed;
  }
}

// Function to draw the ball
function drawBall() {
  noStroke();
  fill(255);

  ellipse(ballX + r, ballY, r * 2, r * 2); // Ball body
}

// Trigger when the mouse is pressed
function mousePressed() {
  if (mousedCLK == true) {
    xspeed = random(-3, 3);
    yspeed = random(-3, 3);
  } else {
    // Set the ball's initial position to where the mouse is pressed
    ballX = mouseX;
    ballY = mouseY;

    // Generate random speeds for the ball movement
    xspeed = 3;
    yspeed = 3;
  }
  mousedCLK = true;
}
