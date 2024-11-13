let balance = 0;
let currentLevel = 0;
let playerSkin = 'blue'; // Стандартный скин игрока
const skins = [];

// Генерируем скины (140 скинов с разными ценами)
const skinColors = ['#FF5733', '#33FF57', '#3357FF', '#57FF33', '#FF33FF', '#FFFF33', '#33FFFF', '#FF5733'];
for (let i = 0; i < 140; i++) {
    skins.push({
        color: skinColors[i % skinColors.length],
        price: Math.floor(Math.random() * 100) + 20,
        unlocked: false
    });
}

// Добавляем уровни (50 уровней, каждый 50x50 клеток, сложность гарантирована)
const levels = Array.from({ length: 50 }, () => generateMaze(50, 50));

// Обновляем баланс на экране
function updateBalanceDisplay() {
    document.getElementById('balance-display').innerText = `Баланс: ${balance}₽`;
}

// Генерируем проходимый лабиринт с использованием алгоритма для гарантии пути
function generateMaze(width, height) {
    const maze = Array(height).fill().map(() => Array(width).fill(1));
    
    // Создаем начальный путь с использованием алгоритма случайного блуждания
    let stack = [{ x: 1, y: 1 }];
    maze[1][1] = 0;
    
    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const directions = shuffle([{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }]);
        let moved = false;
        
        for (const { x, y } of directions) {
            const nx = current.x + x * 2;
            const ny = current.y + y * 2;
            if (nx > 0 && ny > 0 && nx < width && ny < height && maze[ny][nx] === 1) {
                maze[ny][nx] = 0;
                maze[current.y + y][current.x + x] = 0;
                stack.push({ x: nx, y: ny });
                moved = true;
                break;
            }
        }
        
        if (!moved) stack.pop();
    }
    
    maze[0][1] = 0; // Стартовая позиция
    maze[height - 1][width - 2] = 2; // Финиш
    
    return maze;
}

// Перемешиваем массив для случайного направления
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Начать игру
function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('level-selection').style.display = 'block';
    populateLevelOptions();
}

// Заполняем уровни в списке выбора уровня
function populateLevelOptions() {
    const levelSelect = document.getElementById('level-select');
    levelSelect.innerHTML = '';
    for (let i = 0; i < levels.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = `Уровень ${i + 1}`;
        levelSelect.appendChild(option);
    }
}

// Начать выбранный уровень
function startLevel() {
    currentLevel = parseInt(document.getElementById('level-select').value);
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    playerPosition = { x: 1, y: 0 };
    drawMaze();
    updateBalanceDisplay();
}

// Вернуться в главное меню
function backToMenu() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
}

// Рисуем лабиринт
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

// Открыть магазин
function openShop() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('shop').style.display = 'block';
    renderShop();
}

// Отображаем магазин скинов
function renderShop() {
    const skinsContainer = document.getElementById('skins-container');
    skinsContainer.innerHTML = '';
    skins.forEach((skin, index) => {
        const skinDiv = document.createElement('div');
        skinDiv.classList.add('skin');
        skinDiv.style.backgroundColor = skin.color;
        skinDiv.innerText = `${skin.price}₽`;
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
                    alert("Недостаточно средств!");
                }
            };
        }
        skinsContainer.appendChild(skinDiv);
    });
}

// Инициализация
backToMenu();
