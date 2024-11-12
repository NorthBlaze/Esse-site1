const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isGameOver = false;
let score = 0;
let bossDefeated = false;

// Параметры игрока
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    color: "blue",
    speed: 5,
    bullets: [],
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }
};

// Враги (зомби) и босс
const zombies = [];
const boss = { x: 0, y: 0, width: 80, height: 80, health: 50, color: 'darkred', active: false };

// Функция для создания зомби
function spawnZombie() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    zombies.push({ x, y, width: 30, height: 30, speed: 1.5 });
}

// Функция для рисования зомби и босса
function drawZombies() {
    zombies.forEach((zombie, index) => {
        ctx.fillStyle = "red";
        ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

        // Движение зомби к игроку
        let dx = player.x - zombie.x;
        let dy = player.y - zombie.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        zombie.x += (dx / distance) * zombie.speed;
        zombie.y += (dy / distance) * zombie.speed;

        if (
            zombie.x < player.x + player.width &&
            zombie.x + zombie.width > player.x &&
            zombie.y < player.y + player.height &&
            zombie.y + zombie.height > player.y
        ) {
            isGameOver = true;
            document.getElementById('restartButton').style.display = 'block';
        }
    });

    if (boss.active) {
        ctx.fillStyle = boss.color;
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

        // Движение босса к игроку
        let dx = player.x - boss.x;
        let dy = player.y - boss.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        boss.x += (dx / distance) * 1; // Босс медленнее, но сильнее
        boss.y += (dy / distance) * 1;

        if (
            boss.x < player.x + player.width &&
            boss.x + boss.width > player.x &&
            boss.y < player.y + player.height &&
            boss.y + boss.height > player.y
        ) {
            isGameOver = true;
            document.getElementById('restartButton').style.display = 'block';
        }
    }
}

// Выстрелы игрока
function drawBullets() {
    player.bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

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

                if (score >= 100 && !boss.active && !bossDefeated) {
                    boss.active = true;
                    boss.x = Math.random() * canvas.width;
                    boss.y = Math.random() * canvas.height;
                }
            }
        });

        if (boss.active && bullet.x < boss.x + boss.width &&
            bullet.x + bullet.width > boss.x &&
            bullet.y < boss.y + boss.height &&
            bullet.y + bullet.height > boss.y) {
            player.bullets.splice(index, 1);
            boss.health -= 1;

            if (boss.health <= 0) {
                boss.active = false;
                bossDefeated = true;
                score += 100;
            }
        }

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            player.bullets.splice(index, 1);
        }
    });
}

// Игровой цикл
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    drawZombies();
    drawBullets();

    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Сброс игры
function resetGame() {
    isGameOver = false;
    score = 0;
    bossDefeated = false;
    boss.active = false;
    boss.health = 50;
    zombies.length = 0;
    player.bullets.length = 0;
    document.getElementById('restartButton').style.display = 'none';
    gameLoop();
}

// Управление игроком
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') player.move(0, -player.speed);
    if (e.key === 'ArrowDown') player.move(0, player.speed);
    if (e.key === 'ArrowLeft') player.move(-player.speed, 0);
    if (e.key === 'ArrowRight') player.move(player.speed, 0);
});

canvas.addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    player.bullets.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 5,
        height: 5,
        dx: Math.cos(angle) * 7,
        dy: Math.sin(angle) * 7
    });
});

// Спавн зомби каждые 2 секунды
setInterval(spawnZombie, 2000);

gameLoop();
