//// Code comments were added with the assistance of ChatGPT, an AI language model by OpenAI.

class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y); // Initialize the agent's position as a vector
    this.lastPosition = createVector(x, y); // Store the last position (used for drawing trails)
    this.acceleration = createVector(0, 0); // Initialize acceleration vector (starts with no acceleration)
    this.velocity = createVector(0, 0); // Initialize velocity vector (starts with no movement)
    this.maxSpeed = maxSpeed; // Set the maximum speed the agent can move
    this.maxForce = maxForce; // Set the maximum force that can be applied to change direction
  }

  follow(desiredDirection) {
    desiredDirection = desiredDirection.copy(); // Create a copy of the desired direction vector
    desiredDirection.mult(this.maxSpeed); // Scale the desired direction by the agent's maximum speed
    let steer = p5.Vector.sub(desiredDirection, this.velocity); // Calculate the steering force needed to adjust the velocity towards the desired direction
    steer.limit(this.maxForce); // Limit the steering force to the agent's maximum force
    this.applyForce(steer); // Apply the calculated steering force to the agent
  }

  applyForce(force) {
    this.acceleration.add(force); // Add the force to the agent's acceleration (acceleration accumulates forces)
  }

  update() {
    this.lastPosition = this.position.copy(); // Store the current position as the last position for drawing the trail

    this.velocity.add(this.acceleration); // Update velocity by adding the current acceleration
    this.velocity.limit(this.maxSpeed); // Limit the velocity to the agent's maximum speed
    this.position.add(this.velocity); // Update the position by adding the current velocity
    this.acceleration.mult(0); // Reset acceleration to 0 (since forces should be reapplied each frame)
  }

  checkBorders() {
    // Check if the agent has moved off the screen on the left or right
    if (this.position.x < 0) {
      this.position.x = innerWidth; // Wrap the agent to the right side of the screen
      this.lastPosition.x = innerWidth; // Update last position for smooth trail
    } else if (this.position.x > innerWidth) {
      this.position.x = 0; // Wrap the agent to the left side of the screen
      this.lastPosition.x = 0; // Update last position for smooth trail
    }
    // Check if the agent has moved off the screen on the top or bottom
    if (this.position.y < 0) {
      this.position.y = innerHeight; // Wrap the agent to the bottom of the screen
      this.lastPosition.y = innerHeight; // Update last position for smooth trail
    } else if (this.position.y > innerHeight) {
      this.position.y = 0; // Wrap the agent to the top of the screen
      this.lastPosition.y = 0; // Update last position for smooth trail
    }
  }

  draw() {
    push(); // Save the current drawing state
    blendMode(HARD_LIGHT);
    noStroke();

    fill(random(255), random(255), random(255));
    ellipse(this.lastPosition.x + 5, this.lastPosition.y, 10);
    ellipse(this.lastPosition.x + 10, this.lastPosition.y + 5, 10);
    square(this.lastPosition.x, this.lastPosition.y, 10);

    // Draw a line from the last position to the current position (this creates the trail effect)
    pop(); // Restore the original drawing state
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight); // Create a canvas that fills the browser window
  frameRate(30); // Limit to 30 frames per second
  background(0, 0, 0); // Set the background color to black
  field = generateField(); // Generate the vector field that agents will follow
  generateAgents(); // Generate the agents that will move around the canvas
}

function generateField() {
  let field = []; // Initialize an empty array to hold the vector field
  noiseSeed(Math.random() * 100); // Set a random seed for the noise function (to randomize the field)
  for (let x = 0; x < maxCols; x++) {
    // Loop through each column of the field
    field.push([]); // Add a new empty array for each column
    for (let y = 0; y < maxRows; y++) {
      // Loop through each row of the field
      const value = noise(x / divider, y / divider) * Math.PI * 2; // Generate a noise-based angle for the vector at this position
      field[x].push(p5.Vector.fromAngle(value)); // Create a vector from the angle and store it in the field
    }
  }
  return field; // Return the completed vector field
}

function generateAgents() {
  for (let i = 0; i < 5; i++) {
    // Create 200 agents
    let agent = new Agent(
      innerWidth - 100,
      Math.random() * innerHeight,
      4, // Maximum speed of the agent
      0.6 // Maximum force the agent can apply to change direction
    );
    agents.push(agent); // Add the new agent to the list of agents
  }
}

const fieldSize = 10; // Size of each cell in the vector field
const maxCols = Math.ceil(innerWidth / fieldSize); // Calculate the number of columns in the field based on the canvas width
const maxRows = Math.ceil(innerHeight / fieldSize); // Calculate the number of rows in the field based on the canvas height
const divider = 4; // Divider to control the scaling of the noise function (affects the smoothness of the vector field)
let field; // Declare a variable to hold the vector field
let agents = []; // Initialize an empty array to hold the agents

function draw() {
  for (let agent of agents) {
    const x = Math.floor(agent.position.x / fieldSize); // Determine the agent's position in the field grid (x coordinate)
    const y = Math.floor(agent.position.y / fieldSize); // Determine the agent's position in the field grid (y coordinate)
    const desiredDirection = field[x][y]; // Get the vector from the field that corresponds to the agent's position
    agent.follow(desiredDirection); // Have the agent follow the direction of the vector
    agent.update(); // Update the agent's position based on its velocity and acceleration
    agent.checkBorders(); // Check if the agent has moved off the screen and wrap it around if necessary
    agent.draw(); // Draw the agent's square on the canvas to leave a permanent mark
  }
}
