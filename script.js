const levels = [
    // Level 1 (Small)
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
    ],
    // Level 2 (Medium)
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
    ],
    // Level 3 (Hard)
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
        [1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
    ],
    // Level 4 (Big Challenge: 20x30)
    Array(20).fill().map((_, y) => 
        Array(30).fill().map((_, x) => {
            // Complex path logic for a 20x30 maze
            // Creates a difficult maze with some dead ends
            if ((y % 2 === 0 || x % 2 === 0) && !(y === 19 && x === 28)) return 1; // Walls
            if (y === 0 && x === 1) return 0; // Starting point
            if (y === 19 && x === 28) return 2; // Ending point
            return Math.random() < 0.2 ? 1 : 0; // Randomly add walls
        })
    )
];

let currentLevel = 0;
let playerPosition = { x: 1, y: 0 }; // Starting position
const mazeContainer = document.getElementById('maze');
const levelSelect = document.getElementById('level-select');

function drawMaze() {
    mazeContainer.innerHTML = '';
    const maze = levels[currentLevel];
    mazeContainer.style.gridTemplateColumns = `repeat(${maze[0].length}, 25px)`;
    mazeContainer.style.gridTemplateRows = `repeat(${maze.length}, 25px)`;

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[y][x] === 1) cell.classList.add('wall');
            if (maze[y][x] === 2) cell.classList.add('end');
            if (playerPosition.x === x && playerPosition.y === y) {
                cell.classList.add('start');
            }
            mazeContainer.appendChild(cell);
        }
    }
}

function movePlayer(dx, dy) {
    const maze = levels[currentLevel];
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    if (newX >= 0
