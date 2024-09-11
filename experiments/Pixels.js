class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    const a = Math.random() * Math.PI * 5;
    const v = 0.2 + Math.random();
    this.velocity = createVector(Math.cos(a) * v, Math.sin(a) * v);
    this.lifespan = 200 + Math.random() * 100;
  }

  update() {
    this.lifespan--;

    this.velocity.mult(0.99);
    this.position.add(this.velocity);
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    noStroke();
    fill(random(255), random(255), random(255));
    ellipse(3, 0, 6);
    ellipse(6, 3, 6);
    square(0, 0, 6);
    pop();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
}

function generateParticles(x, y) {
  for (let i = 0; i < 200; i++) {
    const px = x + random(-10, 10);
    const py = y + random(-10, 10);
    const particle = new Particle(px, py);
    particles.push(particle);
  }
}

let particles = [];

function draw() {
  background(0, 0, 0);

  for (let particle of particles) {
    particle.update();
    particle.draw();

    if (particle.isDead()) {
      particles.splice(particles.indexOf(particle), 1);
    }
  }
}

function mouseClicked() {
  generateParticles(mouseX, mouseY);
}
