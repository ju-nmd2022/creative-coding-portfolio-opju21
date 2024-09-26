class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  follow(desiredDirection) {
    desiredDirection = desiredDirection.copy();
    desiredDirection.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desiredDirection, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.lastPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkBorders() {
    if (this.position.x < 0) {
      this.position.x = innerWidth - 10;
      this.lastPosition.x = innerWidth - 10;
    } else if (this.position.x > innerWidth) {
      this.position.x = 0;
      this.lastPosition.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = innerHeight - 10;
      this.lastPosition.y = innerHeight - 10;
    } else if (this.position.y > innerHeight) {
      this.position.y = 0;
      this.lastPosition.y = 0;
    }
  }

  draw() {
    const col = get(this.position.x, this.position.y);
    this.behaveBasedOnColor(col);
    noStroke();
    blendMode(HARD_LIGHT);
    fill(random(255), random(255), random(255));
    ellipse(this.lastPosition.x + 5, this.lastPosition.y, 10);
    ellipse(this.lastPosition.x + 10, this.lastPosition.y + 5, 10);
    square(this.lastPosition.x, this.lastPosition.y, 10);
  }

  behaveBasedOnColor(col) {
    let r = red(col);
    let g = green(col);
    let b = blue(col);

    if (r > 110) {
      this.maxSpeed = 5;
    } else if (g > 110) {
      this.maxSpeed = 2.5;
    } else if (b > 110) {
      this.velocity.rotate(random(-PI / 2, PI / 2));
    } else {
      this.maxSpeed = 4;
    }
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0, 0, 0);
  field = generateField();
  generateAgents();
}

function generateField() {
  let field = [];
  noiseSeed(Math.random() * 100);
  for (let x = 0; x < maxCols; x++) {
    field.push([]);
    for (let y = 0; y < maxRows; y++) {
      const value = noise(x / divider, y / divider) * Math.PI * 2;
      field[x].push(p5.Vector.fromAngle(value));
    }
  }
  return field;
}

function generateAgents() {
  for (let i = 0; i < 10; i++) {
    let agent = new Agent(innerWidth / 2, 100, 10, 0.5);
    agents.push(agent);
  }
}

const fieldSize = 10;
const maxCols = Math.ceil(innerWidth / fieldSize);
const maxRows = Math.ceil(innerHeight / fieldSize);
const divider = 10;
let field;
let agents = [];

function draw() {
  for (let agent of agents) {
    const x = Math.floor(agent.position.x / fieldSize);
    const y = Math.floor(agent.position.y / fieldSize);
    const desiredDirection = field[x][y];
    agent.follow(desiredDirection);
    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}
