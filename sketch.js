let gridSize = 24;   // Grid 24x24
let cellSize = 40;   // Ajustado para encajar
let grid = [];
let words = [];

function setup() {
  let canvas = createCanvas(gridSize * cellSize, gridSize * cellSize);
  canvas.parent('canvas-container');
  noLoop();
}

document.getElementById('generateBtn').addEventListener('click', () => {
  const input = document.getElementById('wordInput').value;
  words = input.split(',').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);

  // Re-crear canvas si cambian tamaño o celda
  resizeCanvas(gridSize * cellSize, gridSize * cellSize);

  grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

  placeWords();
  fillEmptyCells();
  redraw();

  document.getElementById('wordList').innerHTML =
    '<p><strong>Palabras:</strong></p><ol>' +
    words.map(word => `<li>${word}</li>`).join('') +
    '</ol>';
});

function draw() {
  background(255);
  drawGrid();
}

function drawGrid() {
  textAlign(CENTER, CENTER);
  textSize(16);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      fill(255);
      stroke(0);
      rect(j * cellSize, i * cellSize, cellSize, cellSize);
      fill(0);
      text(grid[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
    }
  }
}

function placeWords() {
  const directions = [
    { x: 1, y: 0 },   // →
    { x: -1, y: 0 },  // ←
    { x: 0, y: 1 },   // ↓
    { x: 0, y: -1 },  // ↑
    { x: 1, y: 1 },   // ↘
    { x: -1, y: -1 }, // ↖
    { x: -1, y: 1 },  // ↙
    { x: 1, y: -1 }   // ↗
  ];

  words.forEach(word => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 500) {
      attempts++;
      const dir = random(directions);
      const startRow = floor(random(gridSize));
      const startCol = floor(random(gridSize));

      const endRow = startRow + dir.y * (word.length - 1);
      const endCol = startCol + dir.x * (word.length - 1);

      if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) continue;

      let collision = false;
      for (let i = 0; i < word.length; i++) {
        const row = startRow + dir.y * i;
        const col = startCol + dir.x * i;
        if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
          collision = true;
          break;
        }
      }

      if (collision) continue;

      for (let i = 0; i < word.length; i++) {
        const row = startRow + dir.y * i;
        const col = startCol + dir.x * i;
        grid[row][col] = word[i];
      }

      placed = true;
    }

    if (!placed) {
      console.warn(`No se pudo colocar la palabra: ${word}`);
    }
  });
}

function fillEmptyCells() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letters.charAt(floor(random(letters.length)));
      }
    }
  }
}


