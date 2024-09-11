// Code snippet, with edits from me, from Patt Vira (27 mars 2024) p5.js Coding Tutorial | 💖 Exploding Hearts 💖 (Particle Systems). https://www.youtube.com/watch?v=YgDY7l2W9eE

let hearts = [];
let currentColor;

function setup() {
  createCanvas(innerWidth, innerHeight);
  angleMode(DEGREES); // Use degrees for angles
  currentColor = getRandomColor();
}

function draw() {
  background(0);

  // Loop through and display each heart
  for (let i = hearts.length - 1; i > 0; i--) {
    hearts[i].updateHeart();
    hearts[i].displayHeart();
    if (hearts[i].done == true) {
      hearts.splice(i, 1);
    }
  }
  print(hearts.length);
}

// Function to generate a random color
function getRandomColor() {
  return {
    red: random(255),
    green: random(255),
    blue: random(255),
  };
}

// Add new heart on mouse press
function mousePressed() {
  // Create and push a new Heart with random parameters
  hearts.push(new Heart(mouseX, mouseY));
}

class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.num = floor(random(30, 50)); // Random number of points
    this.r = random(50, 100); // Random size
    this.dr = 4;
    this.limit = random(100, 140);
    this.fall = false;
    this.done = false;
    this.color = getRandomColor(); // Assign each heart a random color
    this.shape = [];

    // Create particles based on heart equation
    for (let i = 0; i < this.num; i++) {
      let angle = (360 / this.num) * i;
      let pos = this.heartEqn(angle, this.r);
      this.shape[i] = new Particle(pos.x, pos.y); // Pass x and y to Particle
    }
  }
  updateHeart() {
    for (let i = 0; i < this.num; i++) {
      let angle = (360 / this.num) * i;

      //this.shape[i].updateParticle();
      if (this.fall == false) {
        this.shape[i].position = this.heartEqn(angle, this.r);
      } else {
        this.shape[i].updateParticle();
      }
    }
    if (this.r < this.limit) {
      this.r += this.dr;
    } else {
      this.fall = true;
    }
  }
  displayHeart() {
    push(); // Save the current drawing state
    fill(this.color.red, this.color.green, this.color.blue); // Use the heart's own color
    translate(this.x, this.y); // Move to the heart's position
    let sum = 0;
    // Display each particle
    for (let i = 0; i < this.num; i++) {
      this.shape[i].displayParticle();
      if (this.shape[i].offScreen() == true) {
        sum += 1;
      }
      if (sum == this.num) {
        this.done = true;
      }
    }
    pop(); // Restore the original drawing state
  }

  heartEqn(angle, r) {
    let x = sqrt(2) * pow(sin(angle), 3) * r; // Calculate x using sin
    let y = (pow(-cos(angle), 3) - pow(cos(angle), 2) + 2 * cos(angle)) * -r; // Correct cos and formula for y
    return createVector(x, y);
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y); // Store the position as a vector
    //this.velocity = createVector(1, 1);
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector(0, 1);
  }
  updateParticle() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }
  displayParticle() {
    noStroke();
    ellipse(this.position.x + 5, this.position.y, 10, 10);
    ellipse(this.position.x + 10, this.position.y + 5, 10, 10);
    square(this.position.x, this.position.y, 10);
  }
  offScreen() {
    if (this.position.y > height) {
      return true;
    } else {
      return false;
    }
  }
}
