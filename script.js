// Инициализация переменных
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddleX, ballX, ballY, ballSpeedX, ballSpeedY;
let paddleWidth = 100, paddleHeight = 10, ballRadius = 10;
let paddleSpeed = 7, ballSpeedMultiplier = 1;
let bricks = [], score = 0, coins = 0;
let gameOver = false;
const brickWidth = 75, brickHeight = 20, brickPadding = 10, brickOffsetTop = 30, brickOffsetLeft = 30;
const bonuses = [];
const canvasWidth = canvas.width = window.innerWidth * 0.8;
const canvasHeight = canvas.height = window.innerHeight * 0.6;

// Инициализация блоков
function createBricks() {
    bricks = [];
    for (let row = 0; row < 5; row++) {
        bricks[row] = [];
        for (let col = 0; col < Math.floor((canvasWidth - brickOffsetLeft * 2) / (brickWidth + brickPadding)); col++) {
            bricks[row][col] = { x: 0, y: 0, status: 1, bonus: null };
        }
    }
}

// Старт игры
function startGame() {
    paddleX = (canvasWidth - paddleWidth) / 2;
    ballX = canvasWidth / 2;
    ballY = canvasHeight - 30;
    ballSpeedX = 4 * ballSpeedMultiplier;
    ballSpeedY = -4 * ballSpeedMultiplier;

    score = 0;
    coins = 0;
    gameOver = false;
    document.getElementById("score").textContent = `Очки: ${score}`;
    document.getElementById("coins").textContent = `Монеты: ${coins}`;
    createBricks();
    document.getElementById("gameOverMessage").classList.add("hidden");
    gameLoop();
}

// Главный игровой цикл
function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Движение мяча
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvasHeight - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            score++;
            coins++;
            document.getElementById("score").textContent = `Очки: ${score}`;
            document.getElementById("coins").textContent = `Монеты: ${coins}`;
        } else if (ballY + ballRadius > canvasHeight) {
            gameOver = true;
            document.getElementById("gameOverMessage").classList.remove("hidden");
            return;
        }
    }

    // Столкновение с блоками
    for (let row = 0; row < bricks.length; row++) {
        for (let col = 0; col < bricks[row].length; col++) {
            const brick = bricks[row][col];
            if (brick.status === 1) {
                if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = 0;
                    createBonus(brick.x, brick.y);
                    score += 10;
                    coins++;
                    document.getElementById("score").textContent = `Очки: ${score}`;
                    document.getElementById("coins").textContent = `Монеты: ${coins}`;
                }
            }
        }
    }

    // Рисование блоков
    for (let row = 0; row < bricks.length; row++) {
        for (let col = 0; col < bricks[row].length; col++) {
            const brick = bricks[row][col];
            if (brick.status === 1) {
                brick.x = brickOffsetLeft + col * (brickWidth + brickPadding);
                brick.y = brickOffsetTop + row * (brickHeight + brickPadding);
                ctx.fillStyle = "#0095DD";
                ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
            }
        }
    }

    // Рисование платформы
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);

    // Управление движением платформы
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && paddleX > 0) {
            paddleX -= paddleSpeed;
        } else if (e.key === 'ArrowRight' && paddleX < canvasWidth - paddleWidth) {
            paddleX += paddleSpeed;
        }
    });

    requestAnimationFrame(gameLoop);
}

// Функция для создания бонуса
function createBonus(x, y) {
    const bonusType = Math.random();
    const bonus = { x, y, width: 20, height: 20, type: '' };

    if (bonusType < 0.2) {
        bonus.type = 'slowBall';
    } else if (bonusType < 0.4) {
        bonus.type = 'freezeBall';
    } else if (bonusType < 0.6) {
        bonus.type = 'sizeIncrease';
    } else if (bonusType < 0.8) {
        bonus.type = 'speedIncrease';
    } else {
        bonus.type = 'ballSpeedIncrease';
    }

    bonuses.push(bonus);
}

// Обновление бонусов
function updateBonuses() {
    bonuses.forEach((bonus, index) => {
        bonus.y += 5;
        ctx.fillStyle = "#FF5733";
        ctx.fillRect(bonus.x, bonus.y, bonus.width, bonus.height);

        if (bonus.y + bonus.height > canvasHeight - paddleHeight && bonus.x > paddleX && bonus.x < paddleX + paddleWidth) {
            // Применение бонуса
            if (bonus.type === 'slowBall') {
                ballSpeedMultiplier = 0.5;
            } else if (bonus.type === 'freezeBall') {
                ballSpeedMultiplier = 0;
                setTimeout(() => {
                    ballSpeedMultiplier = 1;
                }, 2000);
            } else if (bonus.type === 'sizeIncrease') {
                paddleWidth += 20;
            } else if (bonus.type === 'speedIncrease') {
                paddleSpeed += 2;
            } else if (bonus.type === 'ballSpeedIncrease') {
                ballSpeedX *= 1.2;
                ballSpeedY *= 1.2;
            }

            bonuses.splice(index, 1);
        }
    });
}

// Начать игру при нажатии кнопки
document.getElementById("restartBtn").addEventListener("click", startGame);
