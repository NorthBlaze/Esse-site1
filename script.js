document.addEventListener('DOMContentLoaded', () => {
    const mazeContainer = document.getElementById('maze');

    // Определение уровня лабиринта (0 - стена, 1 - путь, 2 - начало, 3 - цель)
    const mazeLayout = [
        [2, 1, 1, 0, 0, 0, 0, 0, 0, 3],
        [0, 0, 1, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0]
    ];

    // Отображение лабиринта
    let playerPosition = { x: 0, y: 0 };

    function renderMaze() {
        mazeContainer.innerHTML = '';
        mazeLayout.forEach((row, y) => {
            row.forEach((cell, x) => {
                const div = document.createElement('div');
                div.classList.add('cell');
                if (cell === 0) div.classList.add('wall');
                if (cell === 1) div.classList.add('path');
                if (cell === 2) {
                    div.classList.add('start');
                    playerPosition = { x, y };
                }
                if (cell === 3) div.classList.add('goal');
                mazeContainer.appendChild(div);
            });
        });
        updatePlayerPosition();
    }

    // Обновление позиции игрока
    function updatePlayerPosition() {
        const cells = mazeContainer.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('start'));
        const playerCell = mazeContainer.querySelector(
            `.cell:nth-child(${playerPosition.y * 10 + playerPosition.x + 1})`
        );
        playerCell.classList.add('start');
    }

    // Перемещение игрока
    function movePlayer(dx, dy) {
        const newX = playerPosition.x + dx;
        const newY = playerPosition.y + dy;

        if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
            const nextCell = mazeLayout[newY][newX];
            if (nextCell !== 0) { // 0 - стена
                playerPosition.x = newX;
                playerPosition.y = newY;
                updatePlayerPosition();

                // Проверка, достиг ли игрок цели
                if (nextCell === 3) {
                    alert('Поздравляем! Вы достигли цели!');
                    renderMaze(); // Перезапуск игры
                }
            }
        }
    }

    // Управление WASD
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
                movePlayer(0, -1);
                break;
            case 's':
                movePlayer(0, 1);
                break;
            case 'a':
                movePlayer(-1, 0);
                break;
            case 'd':
                movePlayer(1, 0);
                break;
        }
    });

    renderMaze(); // Отобразить лабиринт при загрузке
});
