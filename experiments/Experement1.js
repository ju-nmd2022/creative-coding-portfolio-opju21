const sizeX = 18;
const sizeY = 1;
const gap = 25;
let amount = 12;
const fields = 6;
let grid = [];
const s = 100 / fields;
const centerX = (width - sizeX) / 2;
const centerY = (height - sizeY) / 2;
const sX = sizeX / fields;
const sY = sizeY / fields;

function setup() {
  createCanvas(innerWidth, innerHeight);
  //noCursor();
  // Initialize the grid with false (not clicked)
  for (let i = 0; i < amount; i++) {
    grid[i] = [];
    for (let j = 0; j < amount; j++) {
      grid[i][j] = false; // Initially, no square is clicked
    }
  }
}

function drawElement(counter) {
  push();

  for (let x = 0; x < fields; x++) {
    for (let y = 0; y < fields; y++) {
      push();
      noStroke();
      if (Math.random() < 0.5) {
        fill(random(255), random(255), random(255));
      }

      square(x * sX, y * sY, s);
      pop();
    }
  }
  pop();
}

function draw() {
  background(0, 0, 0);

  noFill();
  stroke(0, 0, 0);
  strokeWeight(1);

  for (let x = -Math.floor(amount / 2); x < Math.ceil(amount / 2); x++) {
    for (let y = -Math.floor(amount / 2); y < Math.ceil(amount / 2); y++) {
      let xPosition = centerX + x * (sizeX + gap);
      let yPosition = centerY + y * (sizeY + gap);
      if (amount % 2 === 0) {
        xPosition += sizeX / 2;
      }
      push();
      translate(xPosition, yPosition);

      drawElement(0);
      pop();
    }
  }

  noLoop();
}

function keyPressed() {
  if (key === "m") {
    loop();
    redraw();
    //amount = random(15);
    noLoop();
  }
}

function mousePressed() {
  push();
  noStroke();
  //fill(0, 0, 0);
  //rect(mouseX - 15, mouseY - 10, 33, 20);
  pop();
}
