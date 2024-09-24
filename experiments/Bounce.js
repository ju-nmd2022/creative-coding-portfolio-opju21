let ballX;
let ballY;
let xspeed;
let yspeed;
let r = 25;
let size = 40; // Size of each grid cell
let gap = 10; // Gap between grid cells

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0);
}

function draw() {
  background(0);

  // Draw grid
  const centerX = (width - size) / 2;
  const centerY = (height - size) / 2;
  const cols = Math.floor(width / (size + gap)); // Number of columns in the grid
  const rows = Math.floor(height / (size + gap)); // Number of rows in the grid

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const xPosition = col * (size + gap);
      const yPosition = row * (size + gap);
      fill(255);
      rect(xPosition, yPosition, size, size); // Draw each cell in the grid
    }
  }

  noStroke();
  // Draw a white rectangle at the top area
  fill(255, 255, 0);
  rect(0, 0, innerWidth, 100);

  // Move the ball if it has been initialized
  if (ballX !== undefined && ballY !== undefined) {
    ballX += xspeed;
    ballY += yspeed;

    // Check for collisions with canvas edges and reverse speed if needed
    if (ballX > width - r || ballX < r) {
      xspeed = -xspeed;
    }
    if (ballY > height - r || ballY < r) {
      yspeed = -yspeed;
    }

    // Draw the ball
    push();
    fill(random(255), random(255), random(255));
    ellipse(ballX + r, ballY, r * 2, r * 2);
    //ellipse(ballX + r * 2, ballY + r, r * 2, r * 2);
    //square(ballX, ballY, r * 2);
    fill(255);
    square(ballX + r, ballY, r / 2);
    ellipse(ballX + r, ballY, r / 2);
    pop();
  }
}

// Trigger when the mouse is pressed
function mousePressed() {
  // Set the ball's initial position to where the mouse is pressed
  ballX = mouseX;
  ballY = mouseY;

  // Generate random speeds for the ball movement
  xspeed = random(5, 10);
  yspeed = random(5, 10);
}
