
const buttons = document.querySelectorAll('.button');
const sequence = [];
let playerSequence = [];
let round = 0;
let currentStep = 0;
let gameOver = false;
let sequencePlaying = false;
let playerName = '';

document.getElementById('startButton').addEventListener('click', () => {
    playerName = document.getElementById('playerName').value;
    if (playerName.trim() !== '') {
        document.querySelector('.input-container').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'flex';
        document.getElementById('playerDisplay').textContent = `Jogador: ${playerName}`;
        nextRound();
    } else {
        alert('Por favor, digite seu nome.');
    }
});

function nextRound() {
    let randomButton;
    do {
        randomButton = Math.floor(Math.random() * 16);
    } while (sequence.includes(randomButton));
    sequence.push(randomButton);
    round++;
    playSequence();
}

function playSequence() {
    document.getElementById('message').textContent = `Fase ${round}`;
    sequencePlaying = true;
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            sequencePlaying = false;
            return;
        }
        const button = buttons[sequence[i]];
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 500);
        i++;
    }, 1000);
}

function checkPlayerMove(index) {
    if (sequencePlaying) return;
    buttons[index].classList.add('active');
    if (sequence[currentStep] === index) {
        currentStep++;
        if (currentStep === sequence.length) {
            currentStep = 0;
            playerSequence = [];
            updatePerformanceTable();
            setTimeout(() => {
                buttons.forEach(button => button.classList.remove('active'));
                nextRound();
            }, 1000);
        }
    } else {
        alert('Game Over!');
        resetGame();
    }
}

function updatePerformanceTable() {
    const tableBody = document.getElementById('performanceTable').querySelector('tbody');
    const newRow = document.createElement('tr');
    const roundCell = document.createElement('td');
    const dateCell = document.createElement('td');

    const now = new Date();
    const date = now.toLocaleDateString();

    roundCell.textContent = round;
    dateCell.textContent = date;

    newRow.appendChild(roundCell);
    newRow.appendChild(dateCell);
    tableBody.appendChild(newRow);
}

function resetGame() {
    sequence.length = 0;
    playerSequence.length = 0;
    round = 0;
    currentStep = 0;
    gameOver = false;
    sequencePlaying = false;
    buttons.forEach(button => button.classList.remove('active'));
    nextRound();
}

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (!gameOver && !sequencePlaying) {
            playerSequence.push(index);
            checkPlayerMove(index);
        }
    });
    button.addEventListener('touchstart', (event) => {
        event.preventDefault();
        if (!gameOver && !sequencePlaying) {
            playerSequence.push(index);
            checkPlayerMove(index);
        }
    });
});

document.getElementById('exportButton').addEventListener('click', () => {
    const table = document.getElementById('performanceTable');
    let csvContent = 'Rodada,Data\n';
    for (let i = 1; i < table.rows.length; i++) {
        let rowData = [];
        for (let cell of table.rows[i].cells) {
            rowData.push(cell.textContent);
        }
        csvContent += rowData.join(',') + '\n';
    }
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playerName}_desempenho.csv`;
    a.click();
    URL.revokeObjectURL(url);
	
});
