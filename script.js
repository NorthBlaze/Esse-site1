const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isGameOver = false;
let score = 0;
let health = 100;
let lastShotTime = 0;
let keys = {}; // Для отслеживания нажатых клавиш
let mouseX = 0, mouseY = 0;
let zombies = [];
let bullets = [];

// Игрок
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    color: "blue",
    speed: 5,
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); // тело игрока
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
const maxZombies = 50;

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

// Отрисовка зомби
function drawZombies() {
    zombies.forEach((zombie, index) => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, 15, 0, Math.PI * 2); // голова
        ctx.fill();
        ctx.fillRect(zombie.x - 10, zombie.y + 15, 20, 25); // тело

        // Движение зомби к игроку
        let dx = player.x - zombie.x;
        let dy = player.y - zombie.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        zombie.x += (dx / distance) * zombie.speed;
        zombie.y += (dy / distance) * zombie.speed;

        // Столкновение с игроком
        if (
            zombie.x < player.x + player.width &&
            zombie.x + zombie.width > player.x &&
            zombie.y < player.y + player.height &&
            zombie.y + zombie.height > player.y
        ) {
            health -= 1;
            zombies.splice(index, 1); // Уничтожаем зомби
        }
    });
}

// Стрельба
function shootBullet() {
    const currentTime = Date.now();
    if (currentTime - lastShotTime > 500) { // Интервал между выстрелами - 0.5 секунды
        lastShotTime = currentTime;
        const angle = Math.atan2(mouseY - (player.y + player.height / 2), mouseX - (player.x + player.width / 2));
        bullets.push({
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
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Столкновение пуль с зомби
        zombies.forEach((zombie, zombieIndex) => {
            if (
                bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.y + bullet.height > zombie.y
            ) {
                bullets.splice(index, 1);
                zombies.splice(zombieIndex, 1);
                score += 10;
            }
        });
    });
}

// Обновление счета и здоровья
function drawScoreAndHealth() {
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Health: ${health}`, 10, 60);
}

// Проверка завершения игры
function checkGameOver() {
    if (health <= 0) {
        isGameOver = true;
        document.getElementById('restartButton').style.display = 'block';
    }
}

// Игровой цикл
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.move();
    player.draw();
    drawZombies();
    drawBullets();
    drawScoreAndHealth();
    checkGameOver();

    // Спавн зомби после 300 очков
    if (score >= 300) {
        for (let i = 0; i < 10; i++) { 
            spawnZombie(); 
        }
    }

    // Продолжаем игровой цикл
    requestAnimationFrame(gameLoop);
}

// Сброс игры
function resetGame() {
    isGameOver = false;
    score = 0;
    health = 100;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    zombies.length = 0;
    bullets.length = 0;
    document.getElementById('restartButton').style.display = 'none';
    gameLoop();
}

// Управление
document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// Стрельба
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener('mousedown', shootBullet);

// Генерация зомби каждые 2 секунды
setInterval(spawnZombie, 2000);

// Начало игрового цикла
gameLoop();
