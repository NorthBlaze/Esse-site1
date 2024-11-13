let balance = 0;
let playerPosition = { x: 1, y: 1 };

// Определение простого лабиринта: 1 - стена, 0 - путь
const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
];

// Позиция цели
const goalPosition = { x: 9, y: 8 };

// Функция для начала игры
function startGame() {
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    renderMaze();
    document.addEventListener("keydown", movePlayer);
}

// Функция для отрисовки лабиринта
function renderMaze() {
    const mazeContainer = document.getElementById("maze");
    mazeContainer.innerHTML = ""; // Очистка лабиринта перед перерисовкой

    mazeLayout.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            if (cell === 1) {
                cellElement.classList.add("wall");
            } else if (x === playerPosition.x && y === playerPosition.y) {
                cellElement.classList.add("player");
            } else if (x === goalPosition.x && y === goalPosition.y) {
                cellElement.classList.add("goal");
            } else {
                cellElement.classList.add("path");
            }
            mazeContainer.appendChild(cellElement);
        });
    });
}

// Функция для перемещения игрока
function movePlayer(event) {
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (event.key) {
        case "ArrowUp":
            newY -= 1;
            break;
        case "ArrowDown":
            newY += 1;
            break;
        case "ArrowLeft":
            newX -= 1;
            break;
        case "ArrowRight":
            newX += 1;
            break;
        default:
            return;
    }

    // Проверка, чтобы игрок не проходил сквозь стены
    if (mazeLayout[newY] && mazeLayout[newY][newX] === 0) {
        playerPosition = { x: newX, y: newY };
        renderMaze();
    }

    // Проверка на достижение цели
    if (playerPosition.x === goalPosition.x && playerPosition.y === goalPosition.y) {
        balance += 100;
        document.getElementById("balance-display").innerText = `Баланс: ${balance}₽`;
        alert("Поздравляем! Вы прошли лабиринт!");
        backToMenu();
    }
}

// Функция для возврата в главное меню
function backToMenu() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
    document.removeEventListener("keydown", movePlayer);
}
