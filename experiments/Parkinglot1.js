const sizeX = 18;
const sizeY = 1;
const gap = 30;
const amount = 10;
const fields = 6;
const size = 10;

function setup() {
  createCanvas(innerWidth, innerHeight);
  //noCursor();
}

function drawElement(counter) {
  push();
  const s = size + 4 / fields;
  const sX = sizeX / fields;
  const sY = sizeY / fields;
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
  console.log(mouseX, mouseY);
  noFill();
  stroke(0, 0, 0);
  strokeWeight(1);

  const centerX = (width - sizeX) / 2;
  const centerY = (height - sizeY) / 2;
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
