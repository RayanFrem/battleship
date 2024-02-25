class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    hit() {
        this.hits++;
        if (this.hits === this.length) {
            this.sunk = true;
        }
    }

    isSunk() {
        return this.sunk;
    }
}

class Gameboard {
    constructor() {
        this.ships = [];
        this.attacks = [];
    }

    placeShip(length, coordinates) {
        const ship = new Ship(length);
        this.ships.push({ ship, coordinates });
    }

    receiveAttack(x, y) {
        let hit = false;
        this.ships.forEach(({ ship, coordinates }) => {
            coordinates.forEach(coord => {
                if (coord[0] === x && coord[1] === y) {
                    ship.hit();
                    hit = true;
                }
            });
        });
        this.attacks.push({ x, y, hit });
        return hit;
    }

    allSunk() {
        return this.ships.every(({ ship }) => ship.isSunk());
    }
}

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();

playerBoard.placeShip(3, [[2, 2], [2, 3], [2, 4]]);
computerBoard.placeShip(3, [[5, 5], [5, 6], [5, 7]]);

function renderBoard(boardElement, gameboard, isComputer) {
    boardElement.innerHTML = '';
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (gameboard.attacks.find(attack => attack.x === x && attack.y === y)) {
                if (gameboard.attacks.find(attack => attack.x === x && attack.y === y).hit) {
                    cell.classList.add('hit');
                } else {
                    cell.classList.add('miss');
                }
            }
            if (isComputer) {
                cell.addEventListener('click', () => playerAttack(x, y));
            }
            boardElement.appendChild(cell);
        }
    }
}

function playerAttack(x, y) {
    if (computerBoard.attacks.some(attack => attack.x === x && attack.y === y)) {
        console.log("This location has already been attacked.");
        return;
    }
    const hit = computerBoard.receiveAttack(x, y);
    if (hit) {
        console.log(`Hit at (${x}, ${y})`);
    } else {
        console.log(`Miss at (${x}, ${y})`);
    }
    renderBoard(document.getElementById('computerBoard'), computerBoard, true);
    if (!computerBoard.allSunk()) {
        setTimeout(computerMove, 500);
    } else {
        alert("All computer ships have been sunk! Player wins!");
    }
}

function computerMove() {
    let x, y, valid;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        valid = !playerBoard.attacks.some(attack => attack.x === x && attack.y === y);
    } while (!valid);
    const hit = playerBoard.receiveAttack(x, y);
    if (hit) {
        console.log(`Computer hit at (${x}, ${y})`);
    } else {
        console.log(`Computer miss at (${x}, ${y})`);
    }
    renderBoard(document.getElementById('playerBoard'), playerBoard, false);
    if (playerBoard.allSunk()) {
        alert("All player ships have been sunk! Computer wins!");
    }
}

document.getElementById('resetButton').addEventListener('click', () => {
    window.location.reload();
});

renderBoard(document.getElementById('playerBoard'), playerBoard, false); 
renderBoard(document.getElementById('computerBoard'), computerBoard, true);
