const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isGameOver = false;
let score = 0;
let lastShotTime = 0;
let keys = {}; // Объект для отслеживания нажатых клавиш

// Игрок
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    color: "blue",
    speed: 5,
    health: 100,
    bullets: [],
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); // тело
        ctx.fillStyle = "black"; // оружие
        ctx.fillRect(this.x + this.width / 3, this.y - 10, 10, 20); // оружие в руках
    },
    move() {
        const dx = (keys['d'] ? 1 : 0) + (keys['a'] ? -1 : 0);
        const dy = (keys['s'] ? 1 : 0) + (keys['w'] ? -1 : 0);
        
        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // Ограничение движения по краям экрана
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }
};

// Зомби
const zombies = [];
const maxZombies = 50; // Ограничение на количество зомби

// Функция спавна зомби
function spawnZombie() {
    if (zombies.length < maxZombies) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        switch (side) {
            case 0: x = 0; y = Math.random() * canvas.height; break; // слева
            case 1: x = canvas.width; y = Math.random() * canvas.height; break; // справа
            case 2: x = Math.random() * canvas.width; y = 0; break; // сверху
            case 3: x = Math.random() * canvas.width; y = canvas.height; break; // снизу
        }
        zombies.push({ x, y, width: 30, height: 30, speed: 1.5 });
    }
}

// Функция отрисовки зомби
function drawZombies() {
    if (zombies.length === 0) {
        console.log("No zombies to draw");
    }
    zombies.forEach((zombie, index) => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, 15, 0, Math.PI * 2); // голова зомби
        ctx.fill();
        ctx.fillRect(zombie.x - 10, zombie.y + 15, 20, 25); // тело

        // Движение зомби к игроку
        let dx = player.x - zombie.x;
        let dy = player.y - zombie.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        zombie.x += (dx / distance) * zombie.speed;
        zombie.y += (dy / distance) * zombie.speed;

        // Проверка на столкновение с игроком
        if (
            zombie.x < player.x + player.width &&
            zombie.x + zombie.width > player.x &&
            zombie.y < player.y + player.height &&
            zombie.y + zombie.height > player.y
        ) {
            player.health -= 1;
            zombies.splice(index, 1); // Уничтожение зомби
        }
    });
}

// Стрельба
function shootBullet() {
    const currentTime = Date.now();
    if (currentTime - lastShotTime > 500) { // Интервал между выстрелами - 0.5 секунды
        lastShotTime = currentTime; // Обновляем время последнего выстрела
        const angle = Math.atan2(mouseY - (player.y + player.height / 2), mouseX - (player.x + player.width / 2));
        player.bullets.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            width: 10,
            height: 5,
            dx: Math.cos(angle) * 10,
            dy: Math.sin(angle) * 10
        });
    }
}

// Отрисовка пуль
function drawBullets() {
    player.bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); // Пули как патроны
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Проверка попадания пули в зомби
        zombies.forEach((zombie, zombieIndex) => {
            if (
                bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.y + bullet.height > zombie.y
            ) {
                player.bullets.splice(index, 1);
                zombies.splice(zombieIndex, 1);
                score += 10;
            }
        });
    });
}

// Генерация бонусов
function spawnBonus() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    bonuses.push({ x, y, width: 20, height: 20, type: Math.random() < 0.5 ? 'speed' : 'health' });
}

// Отрисовка бонусов
function drawBonuses() {
    bonuses.forEach((bonus, index) => {
        ctx.fillStyle = bonus.type === 'speed' ? 'green' : 'orange';
        ctx.fillRect(bonus.x, bonus.y, bonus.width, bonus.height);

        // Проверка на столкновение с игроком
        if (
            bonus.x < player.x + player.width &&
            bonus.x + bonus.width > player.x &&
            bonus.y < player.y + player.height &&
            bonus.y + bonus.height > player.y
        ) {
            bonuses.splice(index, 1); // Забираем бонус
            if (bonus.type === 'speed') {
                player.speed += 2; // Увеличиваем скорость игрока
            } else {
                player.health = Math.min(100, player.health + 20); // Восстановление здоровья
            }
        }
    });
}

// Проверка, если здоровье игрока меньше или равно 0
function checkGameOver() {
    if (player.health <= 0) {
        isGameOver = true;
        document.getElementById('restartButton').style.display = 'block'; // Показываем кнопку рестарта
    }
}

// Игровой цикл
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.move();
    player.draw();
    drawZombies(); // Отрисовываем зомби
    drawBullets(); // Отрисовываем пули
    drawBonuses(); // Отрисовываем бонусы
    checkGameOver(); // Проверка, если здоровье игрока меньше или равно 0

    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score} | Health: ${player.health}`, 10, 30); // Отображение счета и здоровья

    // Спавн множества зомби после 300 очков
    if (score >= 300) {
        for (let i = 0; i < 10; i++) { 
            spawnZombie(); 
        }
    }

    // Босс появляется после 100 очков
    if (score >= 100 && !boss.active) {
        boss.active = true;
        boss.x = Math.random() * canvas.width;
        boss.y = Math.random() * canvas.height;
    }

    // Продолжаем игровой цикл
    requestAnimationFrame(gameLoop);
}

// Сброс игры
function resetGame() {
    isGameOver = false;
    score = 0;
    player.health = 100;
    player.speed = 5;
    boss.active = false;
    zombies.length = 0;
    player.bullets.length = 0;
    bonuses.length = 0;
    document.getElementById('restartButton').style.display = 'none';
    gameLoop();
}

// Управление WASD
document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true
});
document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// Управление стрельбой
let mouseX = 0, mouseY = 0;
canvas.addEventListener('mousedown', () => { isShooting = true; });
canvas.addEventListener('mouseup', () => { isShooting = false; });

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (isShooting) shootBullet(); // Стрельба при удерживании кнопки мыши
});

// Генерация бонусов каждые 5 секунд
setInterval(spawnBonus, 5000);

// Спавн зомби каждые 2 секунды
setInterval(spawnZombie, 2000);

// Начало игрового цикла
gameLoop();
