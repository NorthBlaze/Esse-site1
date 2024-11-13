document.addEventListener('DOMContentLoaded', () => {
    const maze = document.getElementById('maze');
    const player = document.getElementById('player');

    let playerPosition = { x: 0, y: 0 };

    const movePlayer = (x, y) => {
        const newX = playerPosition.x + x;
        const newY = playerPosition.y + y;
        const nextCell = document.querySelector(
            `#maze .cell:nth-child(${newY * 10 + newX + 1})`
        );

        if (nextCell && !nextCell.classList.contains('wall')) {
            playerPosition.x = newX;
            playerPosition.y = newY;
            player.style.transform = `translate(${newX * 40}px, ${newY * 40}px)`;

            if (nextCell.classList.contains('goal')) {
                alert('Congratulations! You reached the goal!');
            }
        }
    };

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                movePlayer(0, -1);
                break;
            case 'ArrowDown':
                movePlayer(0, 1);
                break;
            case 'ArrowLeft':
                movePlayer(-1, 0);
                break;
            case 'ArrowRight':
                movePlayer(1, 0);
                break;
        }
    });
});
