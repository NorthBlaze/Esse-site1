let balance = 0;
let currentLevel = 0;
let playerSkin = 'blue'; // Default skin
const skins = [];

// Define the levels (50x50 grid with more complexity)
const levels = [
    generateMaze(50, 50), // Level 1
    generateMaze(50, 50), // Level 2
    generateMaze(50, 50), // Level 3
    generateMaze(50, 50)  // Big Challenge
];

// Skin data (40 skins with random prices)
const skinColors = ['#FF5733', '#33FF57', '#3357FF', '#57FF33', '#FF33FF', '#FFFF33', '#33FFFF', '#FF5733'];
for (let i = 0; i < 40; i++) {
    skins.push({
        color: skinColors[i % skinColors.length],
        price: Math.floor(Math.random() * 100) + 20,
        unlocked: false
    });
}

// Display balance
function updateBalanceDisplay() {
    document.getElementById('balance-display').innerText = `Balance: $${balance}`;
}

// Generate a random maze of given width and height
function generateMaze(width, height) {
    const maze = Array(height).fill().map(() => Array(width).fill(1));
    // Simple randomized paths (customize for more complexity)
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (Math.random() > 0.7) maze[y][x] = 0; // Random open cells
        }
    }
    maze[0][1] = 0; // Start
    maze[height - 1][width - 2] = 2; // End
    return maze;
}

// Start Game
function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('level-selection').style.display = 'block';
}

// Start selected level
function startLevel() {
    currentLevel = parseInt(document.getElementById('level-select').value);
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    playerPosition = { x: 1, y: 0 };
    drawMaze();
    updateBalanceDisplay();
}

// Return to main menu
function backToMenu() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
}

// Draw the maze
function drawMaze() {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.innerHTML = '';
    const maze = levels[currentLevel];
    mazeContainer.style.gridTemplateColumns = `repeat(${maze[0].length}, 15px)`;
    mazeContainer.style.gridTemplateRows = `repeat(${maze.length}, 15px)`;

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[y][x] === 1) cell.classList.add('wall');
            if (maze[y][x] === 2) cell.classList.add('end');
            if (playerPosition.x === x && playerPosition.y === y) {
                cell.classList.add('start');
                cell.style.backgroundColor = playerSkin;
            }
            mazeContainer.appendChild(cell);
        }
    }
}

// Open the shop
function openShop() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('shop').style.display = 'block';
    renderShop();
}

// Render the shop with skins
function renderShop() {
    const skinsContainer = document.getElementById('skins-container');
    skinsContainer.innerHTML = '';
    skins.forEach((skin, index) => {
        const skinDiv = document.createElement('div');
        skinDiv.classList.add('skin');
        skinDiv.style.backgroundColor = skin.color;
        skinDiv.innerText = `$${skin.price}`;
        if (skin.unlocked) {
            skinDiv.classList.remove('locked');
            skinDiv.onclick = () => {
                playerSkin = skin.color;
                backToMenu();
            };
        } else {
            skinDiv.classList.add('locked');
            skinDiv.onclick = () => {
                if (balance >= skin.price) {
                    balance -= skin.price;
                    skin.unlocked = true;
                    updateBalanceDisplay();
                    renderShop();
                } else {
                    alert("Not enough balance!");
                }
            };
        }
        skinsContainer.appendChild(skinDiv);
    });
}

// Initialize
backToMenu();
