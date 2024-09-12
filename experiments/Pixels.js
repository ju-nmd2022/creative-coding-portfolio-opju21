// Comments added with ChatGPT
class Particle {
  constructor(x, y) {
    this.position = createVector(x, y); // Initialize particle's position as a vector at (x, y)

    const a = Math.random() * Math.PI * 5; // Generate a random angle for velocity direction
    const v = 0.2 + Math.random(); // Generate a random velocity magnitude between 0.2 and 1.2
    this.velocity = createVector(Math.cos(a) * v, Math.sin(a) * v); // Set the velocity vector based on the angle and magnitude
    this.rotation = random(0, 360);
    this.rotationSpeed = random(0.1, 0.1);
    this.lifespan = 200 + Math.random() * 100; // Assign a random lifespan between 200 and 300 frames
  }

  update() {
    this.lifespan--; // Decrease the particle's lifespan by 1 on each update
    this.rotation += this.rotationSpeed;
    this.velocity.mult(0.99); // Gradually slow down the particle by multiplying velocity by 0.99
    this.position.add(this.velocity); // Update the particle's position by adding the velocity to it
  }

  draw() {
    push(); // Save the current drawing state
    translate(this.position.x, this.position.y); // Move the drawing context to the particle's position
    rotate(this.rotation);
    noStroke(); // Disable stroke (outline) for the shapes
    // Set a random fill color for the particle
    fill(random(255), random(255), random(255));
    // Draw two ellipses and a square at the particle's position to form its shape
    ellipse(3, 0, 6); // First ellipse
    ellipse(6, 3, 6); // Second ellipse
    square(0, 0, 6); // Square
    pop(); // Restore the previous drawing state
  }

  isDead() {
    return this.lifespan <= 0; // Check if the particle's lifespan has reached 0 or below
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight); // Set up the canvas to match the window dimensions
}

function generateParticles(x, y) {
  for (let i = 0; i < 200; i++) {
    // Generate random offsets for particle positions around the (x, y) point
    const px = x + random(-10, 10);
    const py = y + random(-10, 10);

    // Create a new particle at the random position and add it to the particles array
    const particle = new Particle(px, py);
    particles.push(particle);
  }
}

let particles = []; // Initialize an array to store particles

function draw() {
  background(0, 0, 0); // Set the background to black

  // Loop through each particle in the particles array
  for (let particle of particles) {
    particle.update(); // Update the particle's position and velocity
    particle.draw(); // Draw the particle on the canvas

    // If the particle's lifespan has ended, remove it from the array
    if (particle.isDead()) {
      particles.splice(particles.indexOf(particle), 1); // Remove the dead particle from the array
    }
  }
}

function mouseClicked() {
  generateParticles(mouseX, mouseY); // Generate new particles at the mouse click location
}
