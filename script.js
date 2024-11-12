const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    color: 'cyan',
    speed: 7, // Увеличенная скорость
    bullets: [],
};

let enemies = [];
let enemySpeed = 2;
let score = 0;
let level = 1;
let isGameOver = false;

// Загрузка изображений для игрока и врагов
const playerImage = new Image();
playerImage.src = 'player.png'; // Замените на URL или имя вашего изображения для игрока

const enemyImage = new Image();
enemyImage.src = 'enemy.png'; // Замените на URL или имя вашего изображения для врагов

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemySpeed;
        
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }

        if (
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y
        ) {
            isGameOver = true;
            showRestartButton();
        }
    });
}

function drawBullets() {
    player.bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            player.bullets.splice(index, 1);
        }

        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                player.bullets.splice(index, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;

                if (score % 50 === 0) {
                    level++;
                    enemySpeed += 0.5;
                }
            }
        });
    });
}

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 40);
    enemies.push({ x, y: -40, width: 40, height: 40 });
}

function gameLoop() {
    if (isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${level}`, 10, 60);

    requestAnimationFrame(gameLoop);
}

function showRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.style.position = 'absolute';
    restartButton.style.top = '50%';
    restartButton.style.left = '50%';
    restartButton.style.transform = 'translate(-50%, -50%)';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '20px';
    document.body.appendChild(restartButton);

    restartButton.addEventListener('click', () => {
        resetGame();
        restartButton.remove();
    });
}

function resetGame() {
    isGameOver = false;
    score = 0;
    level = 1;
    enemySpeed = 2;
    player.bullets = [];
    enemies = [];
    gameLoop();
}

// Управление
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
    if (e.key === 'ArrowRight' && player.x + player.width < canvas.width) player.x += player.speed;
    if (e.key === ' ') {
        player.bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 7,
        });
    }
});

// Создавать врагов каждую секунду
setInterval(spawnEnemy, 1000);

// Запустить игровой цикл
gameLoop();
