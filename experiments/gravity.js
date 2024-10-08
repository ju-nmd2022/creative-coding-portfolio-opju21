// add more planets with color
class Element {
  constructor(x, y, color) {
    this.position = createVector(x, y); // Set the initial position of the element as a vector
    this.velocity = createVector(4, 4); // Set the initial velocity of the element (moving downwards)
    this.acceleration = createVector(0, 0); // Set the initial acceleration of the element to zero
    this.size = 80; // Set the size of the element (for drawing it as a circle)
    this.mass = 8; // Set the mass of the element (affects how it reacts to forces)
    this.color = color; // Set the color of the element
  }

  applyForce(force) {
    let newForce = force.copy(); // Create a copy of the force to avoid modifying the original vector
    newForce.div(this.mass); // Adjust the force according to the element's mass (F = ma)
    this.acceleration.add(newForce); // Add the adjusted force to the element's acceleration
  }

  update() {
    this.velocity.add(this.acceleration); // Update the velocity based on the current acceleration
    this.position.add(this.velocity); // Update the position based on the current velocity
    this.acceleration.mult(0); // Reset the acceleration to zero (forces must be reapplied each frame)
  }

  draw() {
    noStroke();

    fill(this.color);
    ellipse(this.position.x + this.size / 2, this.position.y, this.size);
    ellipse(
      this.position.x + this.size,
      this.position.y + this.size / 2,
      this.size
    );
    square(this.position.x, this.position.y, this.size); // Draw the element as a circle at its current position
  }
}

class Attractor {
  constructor(x, y) {
    this.position = createVector(x, y); // Set the initial position of the attractor as a vector
    this.size = 100; // Set the size of the attractor (for drawing it as a circle)
    this.mass = 100; // Set the mass of the attractor (affects the strength of its gravitational pull)
  }

  attract(element) {
    let force = p5.Vector.sub(this.position, element.position); // Calculate the vector pointing from the element to the attractor
    let distance = constrain(force.mag(), 5, 25); // Get the magnitude of the force vector and constrain the distance to avoid extreme values
    force.normalize(); // Normalize the force vector to make it a unit vector (direction only)
    let m = (G * element.mass * this.mass) / (distance * distance); // Calculate the magnitude of the gravitational force (using Newton's law of universal gravitation)
    force.mult(m); // Scale the force vector by the calculated magnitude
    return force; // Return the calculated force vector
  }

  draw() {
    fill(0, 0, 0); // Set the fill color to black

    //ellipse(innerWidth / 2, innerHeight / 2, this.size); // Draw the attractor as a circle at its position
  }
}

let elements = []; // Declare a variable to hold the element
let attractor; // Declare a variable to hold the attractor
let G = 1; // Set the gravitational constant (controls the strength of the attraction)

function setup() {
  createCanvas(innerWidth, innerHeight); // Create a canvas that fills the browser window

  for (let i = 0; i < 100; i++) {
    elements.push(
      new Element(i, 100, color(random(255), random(255), random(255)))
    ); // Red element
    elements.push(
      new Element(i, 200, color(random(255), random(255), random(255)))
    ); // Green element
    elements.push(
      new Element(i, 300, color(random(255), random(255), random(255)))
    ); // Blue element
  }

  attractor = new Attractor(innerWidth / 2, innerHeight / 2); // Initialize the attractor at position (400, 300)
}

function draw() {
  background(0, 0, 0); // Set the background color to white
  for (let element of elements) {
    let force = attractor.attract(element); // Calculate the gravitational force exerted by the attractor on the element
    element.applyForce(force); // Apply the calculated force to the element
    element.update(); // Update the element's position and velocity based on the applied forces
    element.draw(); // Draw the element on the canvas
  }
  attractor.draw(); // Draw the attractor on the canvas
}
