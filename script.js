// Переключение между меню
function openLevelSelection() {
    hideAllMenus();
    document.getElementById("level-selection").style.display = "block";
}

function openShop() {
    hideAllMenus();
    document.getElementById("shop").style.display = "block";
}

function startGame() {
    hideAllMenus();
    document.getElementById("game-container").style.display = "block";
    // Здесь можно добавить логику для генерации лабиринта
}

function startLevel() {
    hideAllMenus();
    document.getElementById("game-container").style.display = "block";
    const level = document.getElementById("level-select").value;
    // Добавьте логику для инициализации выбранного уровня
}

function backToMenu() {
    hideAllMenus();
    document.getElementById("main-menu").style.display = "block";
}

// Скрыть все меню
function hideAllMenus() {
    const menus = document.getElementsByClassName("menu");
    for (let menu of menus) {
        menu.style.display = "none";
    }
}

// Пример динамической генерации скинов в магазине
function populateShop() {
    const skinsContainer = document.getElementById("skins-container");
    const colors = ["blue", "red", "green", "yellow", "purple"];
    colors.forEach(color => {
        const button = document.createElement("button");
        button.style.backgroundColor = color;
        button.innerText = color.charAt(0).toUpperCase() + color.slice(1);
        button.onclick = () => {
            // Установить выбранный скин игрока
            alert("Скин " + color + " выбран!");
        };
        skinsContainer.appendChild(button);
    });
}

// Инициализация магазина при загрузке
window.onload = function() {
    populateShop();
};
