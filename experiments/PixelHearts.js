// Code snippet, with edits from me, from Patt Vira (27 mars 2024) p5.js Coding Tutorial | 💖 Exploding Hearts 💖 (Particle Systems). https://www.youtube.com/watch?v=YgDY7l2W9eE
// Comments added with ChatGPT
let hearts = []; // Array to hold the heart objects
let currentColor; // Variable to hold the current random color

function setup() {
  createCanvas(innerWidth, innerHeight); // Create canvas that takes up the full window width and height
  angleMode(DEGREES); // Use degrees instead of radians for angles
  currentColor = getRandomColor(); // Assign a random color to currentColor when the sketch starts
}

function draw() {
  background(0); // Set the background to black

  // Loop through the hearts array in reverse to update and display hearts
  for (let i = hearts.length - 1; i > 0; i--) {
    hearts[i].updateHeart(); // Update the heart's state
    hearts[i].displayHeart(); // Display the heart on the canvas

    // If a heart is "done" (all particles have fallen off screen), remove it from the array
    if (hearts[i].done == true) {
      hearts.splice(i, 1); // Remove the heart from the array
    }
  }
  print(hearts.length); // Print the number of hearts currently on screen to the console
}

// Function to generate a random color
function getRandomColor() {
  return {
    red: random(255), // Generate a random red value
    green: random(255), // Generate a random green value
    blue: random(255), // Generate a random blue value
  };
}

// Add new heart on mouse press
function mousePressed() {
  // Create and push a new heart at the mouse location into the hearts array
  hearts.push(new Heart(mouseX, mouseY));
}

class Heart {
  constructor(x, y) {
    this.x = x; // X position of the heart
    this.y = y; // Y position of the heart
    this.num = floor(random(30, 50)); // Random number of particles (points) in the heart

    this.r = random(50, 100); // Random size of the heart
    this.dr = 4; // Rate at which the heart grows
    this.limit = random(100, 140); // Maximum size before the heart starts falling apart
    this.fall = false; // Whether the particles are falling or not
    this.done = false; // Whether the heart is done (all particles have fallen off screen)
    this.color = getRandomColor(); // Assign a random color to each heart
    this.shape = []; // Array to store the particles (points) that make up the heart

    // Create particles based on heart equation
    for (let i = 0; i < this.num; i++) {
      let angle = (360 / this.num) * i; // Calculate the angle for each particle
      let pos = this.heartEqn(angle, this.r); // Calculate the position based on heart equation
      this.shape[i] = new Particle(pos.x, pos.y); // Create a new particle at the calculated position
    }
  }

  updateHeart() {
    // Loop through each particle and update its position
    for (let i = 0; i < this.num; i++) {
      let angle = (360 / this.num) * i; // Calculate angle for each particle

      // If the heart isn't falling, update particle position based on heart equation
      if (this.fall == false) {
        this.shape[i].position = this.heartEqn(angle, this.r);
      } else {
        this.shape[i].updateParticle(); // If falling, update particle's position based on velocity
      }
    }

    // Increase the heart's radius until it reaches its limit, then make particles fall
    if (this.r < this.limit) {
      this.r += this.dr; // Increase the radius
    } else {
      this.fall = true; // Start making the heart fall
    }
  }

  displayHeart() {
    push(); // Save the current drawing state
    fill(this.color.red, this.color.green, this.color.blue); // Set the fill color for the heart
    translate(this.x, this.y); // Move to the heart's position
    let sum = 0; // Counter for particles off the screen

    // Display each particle
    for (let i = 0; i < this.num; i++) {
      this.shape[i].displayParticle(); // Display the particle

      // Check if the particle is off the screen
      if (this.shape[i].offScreen() == true) {
        sum += 1; // Increase counter if off screen
      }

      // If all particles are off screen, mark the heart as done
      if (sum == this.num) {
        this.done = true;
      }
    }
    pop(); // Restore the original drawing state
  }

  // Heart equation to calculate particle positions based on angle and radius
  heartEqn(angle, r) {
    let x = sqrt(2) * pow(sin(angle), 3) * r; // Calculate x coordinate using a heart equation
    let y = (pow(-cos(angle), 3) - pow(cos(angle), 2) + 2 * cos(angle)) * -r; // Calculate y coordinate using a heart equation
    return createVector(x, y); // Return position as a vector
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y); // Store the initial position of the particle
    this.velocity = p5.Vector.random2D(); // Randomize velocity direction for the particle
    this.acceleration = createVector(0, 1); // Apply constant downward acceleration (gravity)
    this.rotation = random(0, 360); // Initial random rotation angle
    this.rotationSpeed = random(1, 5); // Random speed for the particle's rotation
  }

  updateParticle() {
    this.velocity.add(this.acceleration); // Apply acceleration to the velocity (gravity effect)
    this.position.add(this.velocity); // Update the particle's position based on velocity
    this.rotation += this.rotationSpeed; // Increase the particle's rotation angle
  }

  displayParticle() {
    push(); // Save the current drawing state
    translate(this.position.x, this.position.y); // Move to the particle's position
    rotate(this.rotation); // Rotate the particle
    noStroke(); // Remove stroke (border)
    ellipse(5, 0, 10, 10); // Draw an ellipse at rotated position
    ellipse(10, 5, 10, 10); // Draw a second ellipse
    square(0, 0, 10); // Draw a square at rotated position
    pop(); // Restore the original drawing state
  }

  offScreen() {
    // Check if the particle is off the bottom of the screen
    if (this.position.y > height) {
      return true; // Return true if off screen
    } else {
      return false; // Return false if still on screen
    }
  }
}
