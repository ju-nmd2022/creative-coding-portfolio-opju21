//// Code comments were added with the assistance of ChatGPT, an AI language model by OpenAI.

const size = 18; // Size of each element (a square) in both width and height
const gap = 5; // Gap between elements when placing them on the canvas
const fields = 3; // Number of small squares in each element (6x6 grid)

function setup() {
  createCanvas(innerWidth, innerHeight); // Sets up the canvas to fit the browser window size
  noLoop(); // Stops the draw() function from looping automatically
}

function drawElement() {
  const s = size / fields; // Size of each small square inside the element

  for (let x = 0; x < fields; x++) {
    // Loop over columns in the grid
    for (let y = 0; y < fields; y++) {
      // Loop over rows in the grid
      fill(random(255), random(255), random(255)); // Set a random color for the square
      square(x * s, y * s, s); // Draw the small square at the calculated position and size
    }
  }
}

function draw() {
  background(0); // Set the background to black

  const centerX = (width - size) / 2; // Calculate the X position to center the elements horizontally
  const centerY = (height - size) / 2; // Calculate the Y position to center the elements vertically
  const amount = 12; // Number of elements to draw in a grid

  // Loop to position and draw each element on the canvas
  for (let x = -Math.floor(amount / 2); x < Math.ceil(amount / 2); x++) {
    // Loop over columns of elements
    for (let y = -Math.floor(amount / 2); y < Math.ceil(amount / 2); y++) {
      // Loop over rows of elements
      const xPosition = centerX + x * (size + gap); // Calculate X position for the current element
      const yPosition = centerY + y * (size + gap); // Calculate Y position for the current element
      push(); // Save the current drawing state (to isolate transformations)
      translate(xPosition, yPosition); // Move the drawing origin to the element's position
      drawElement(); // Draw the 6x6 grid element at the translated position
      pop(); // Restore the original drawing state (before translation)
    }
  }
}

function keyPressed() {
  if (key === "m") {
    // Check if the "m" key is pressed
    //redraw(); // Redraw the canvas when the "m" key is pressed
  }
}
