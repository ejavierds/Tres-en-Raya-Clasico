
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const resetAllButton = document.getElementById('resetAllButton');
const timeDisplay = document.getElementById('time');
const drawsDisplay = document.getElementById('draws');
const xWinsDisplay = document.getElementById('xWins');
const oWinsDisplay = document.getElementById('oWins');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');
let draws = 0;
let xWins = 0;
let oWins = 0;
let startTime;
let timerInterval;

const winningConditions = [
    [0, 1, 2, 'horizontal row-1'],
    [3, 4, 5, 'horizontal row-2'],
    [6, 7, 8, 'horizontal row-3'],
    [0, 3, 6, 'vertical col-1'],
    [1, 4, 7, 'vertical col-2'],
    [2, 5, 8, 'vertical col-3'],
    [0, 4, 8, 'diagonal-1'],
    [2, 4, 6, 'diagonal-2']
];

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `Tiempo: ${minutes}:${seconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    if (!startTime) {
        startTimer();
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);
    checkResult();
}

function drawWinningLine(lineType) {
    const line = document.createElement('div');
    line.classList.add('winning-line', ...lineType.split(' '));
    board.appendChild(line);
}

function checkResult() {
    let roundWon = false;
    let winningLineType = '';

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c, lineType] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningLineType = lineType;
            break;
        }
    }

    if (roundWon) {
        drawWinningLine(winningLineType);
        statusDisplay.innerHTML = `¡Jugador ${currentPlayer} ha ganado!`;
        gameActive = false;
        stopTimer();
        if (currentPlayer === 'X') {
            xWins++;
            xWinsDisplay.textContent = `X Victorias: ${xWins}`;
        } else {
            oWins++;
            oWinsDisplay.textContent = `O Victorias: ${oWins}`;
        }
        return;
    }

    if (!gameState.includes('')) {
        statusDisplay.innerHTML = '¡Es un empate!';
        gameActive = false;
        stopTimer();
        draws++;
        drawsDisplay.textContent = `Empates: ${draws}`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `Turno del jugador ${currentPlayer}`;
}

function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = Array(9).fill('');
    statusDisplay.innerHTML = `Turno del jugador ${currentPlayer}`;
    stopTimer();
    startTime = null;
    timeDisplay.textContent = 'Tiempo: 00:00';
    
    const winningLines = document.querySelectorAll('.winning-line');
    winningLines.forEach(line => line.remove());
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X');
        cell.classList.remove('O');
    });
}

function resetAll() {
    draws = 0;
    xWins = 0;
    oWins = 0;
    drawsDisplay.textContent = `Empates: ${draws}`;
    xWinsDisplay.textContent = `X Victorias: ${xWins}`;
    oWinsDisplay.textContent = `O Victorias: ${oWins}`;
    restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
resetAllButton.addEventListener('click', resetAll);

// Inicialización
statusDisplay.innerHTML = `Turno del jugador ${currentPlayer}`;
drawsDisplay.textContent = `Empates: ${draws}`;
xWinsDisplay.textContent = `X Victorias: ${xWins}`;
oWinsDisplay.textContent = `O Victorias: ${oWins}`;