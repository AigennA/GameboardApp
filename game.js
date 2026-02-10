// ============================================
// DEL A: Spelplan (2D-arrayer)
// ============================================

function createBoard(rows, cols) {
    const board = [];
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            board[r][c] = '.';
        }
    }
    return board;
}

function placePiece(board, row, col, piece) {
    const rows = board.length;
    const cols = board[0].length;
    if (row < 0 || row >= rows || col < 0 || col >= cols)
        return false;
    board[row][col] = piece;
    return true;
}

function findPieceOnBoard(board, piece) {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === piece)
                return { row: r, col: c };
        }
    }
    return { row: -1, col: -1 };
}

function boardToString(board) {
    return board.map(row => row.join(' ')).join('\n');
}

// ============================================
// DEL B: Highscores (Sortering & Sökning)
// ============================================

function sortHighscores(scores) {
    const copy = [...scores];
    copy.sort((a, b) => b - a);
    return copy;
}

function findRank(sortedScores, playerScore) {
    const index = sortedScores.indexOf(playerScore);
    if (index === -1) return -1;
    return index + 1;
}

function getScoresAbove(scores, threshold) {
    return scores.filter(s => s >= threshold);
}

function calculateStats(scores) {
    let min = scores[0];
    let max = scores[0];
    let sum = 0;
    for (const score of scores) {
        if (score < min) min = score;
        if (score > max) max = score;
        sum += score;
    }
    return { min, max, average: sum / scores.length };
}

// ============================================
// UI - Interaktion
// ============================================

let board = createBoard(3, 4);
let currentPiece = 'X';
let scores = [2100, 800, 4500, 1500, 3200, 2900, 1800];

function selectPiece(piece) {
    currentPiece = piece;
    document.getElementById('btnX').classList.toggle('active', piece === 'X');
    document.getElementById('btnO').classList.toggle('active', piece === 'O');
    document.getElementById('boardInfo').textContent = `Vald pjäs: ${piece}`;
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.style.gridTemplateColumns = `repeat(${board[0].length}, 56px)`;
    boardEl.innerHTML = '';
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const val = board[r][c];
            if (val !== '.') {
                cell.textContent = val;
                cell.classList.add(`piece-${val}`);
            }
            cell.onclick = () => handleCellClick(r, c);
            boardEl.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    const result = placePiece(board, row, col, currentPiece);
    const info = document.getElementById('boardInfo');
    if (result) {
        info.textContent = `Placerade '${currentPiece}' på (${row}, ${col})`;
        logToConsole(`PlacePiece(board, ${row}, ${col}, '${currentPiece}') → true`, 'green');
    } else {
        info.textContent = `Kunde inte placera på (${row}, ${col})`;
        logToConsole(`PlacePiece(board, ${row}, ${col}, '${currentPiece}') → false`, 'pink');
    }
    renderBoard();
}

function findPiece() {
    const pos = findPieceOnBoard(board, 'O');
    const info = document.getElementById('boardInfo');
    if (pos.row === -1) {
        info.textContent = "'O' hittades inte på spelplanen";
        logToConsole("FindPiece(board, 'O') → (-1, -1)", 'pink');
    } else {
        info.textContent = `'O' hittad på: (${pos.row}, ${pos.col})`;
        logToConsole(`FindPiece(board, 'O') → (${pos.row}, ${pos.col})`, 'yellow');
        const cells = document.querySelectorAll('.cell');
        const index = pos.row * board[0].length + pos.col;
        cells[index].classList.add('found');
        setTimeout(() => cells[index].classList.remove('found'), 800);
    }
}

function resetBoard() {
    board = createBoard(3, 4);
    renderBoard();
    document.getElementById('boardInfo').textContent = 'Spelplanen återställd';
    logToConsole("CreateBoard(3, 4) → ny tom spelplan", 'accent');
}

function renderScores() {
    const sorted = sortHighscores(scores);
    const list = document.getElementById('scoreList');
    list.innerHTML = '';
    sorted.forEach((score, i) => {
        const item = document.createElement('div');
        item.className = 'score-item';
        if (i === 0) item.classList.add('top-1');
        if (i === 1) item.classList.add('top-2');
        if (i === 2) item.classList.add('top-3');
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
        item.innerHTML = `
            <span class="rank">#${i + 1}</span>
            <span class="value">${score.toLocaleString()}</span>
            <span>${medal}</span>
        `;
        list.appendChild(item);
    });
    if (scores.length > 0) {
        const stats = calculateStats(scores);
        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card min">
                <div class="stat-label">Min</div>
                <div class="stat-value">${stats.min.toLocaleString()}</div>
            </div>
            <div class="stat-card max">
                <div class="stat-label">Max</div>
                <div class="stat-value">${stats.max.toLocaleString()}</div>
            </div>
            <div class="stat-card avg">
                <div class="stat-label">Medel</div>
                <div class="stat-value">${stats.average.toFixed(1)}</div>
            </div>
        `;
    }
}

function addScore() {
    const input = document.getElementById('scoreInput');
    const val = parseInt(input.value);
    if (isNaN(val) || val <= 0) return;
    scores.push(val);
    input.value = '';
    renderScores();
    const sorted = sortHighscores(scores);
    const rank = findRank(sorted, val);
    logToConsole(`Ny poäng: ${val} → Rank #${rank}`, 'green');
}

function resetScores() {
    scores = [2100, 800, 4500, 1500, 3200, 2900, 1800];
    renderScores();
    logToConsole("Highscores återställda", 'accent');
}

function logToConsole(text, color = 'white') {
    const output = document.getElementById('consoleOutput');
    const line = document.createElement('div');
    line.className = `line-${color}`;
    line.textContent = `> ${text}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function init() {
    placePiece(board, 0, 0, 'X');
    placePiece(board, 1, 1, 'O');
    placePiece(board, 2, 3, 'X');
    placePiece(board, 2, 2, 'O');
    placePiece(board, 0, 3, 'X');
    renderBoard();
    renderScores();
    logToConsole("=== DEL A: Spelplan ===", 'white');
    logToConsole("CreateBoard(3, 4)", 'accent');
    logToConsole("PlacePiece(board, 0, 0, 'X') → true", 'green');
    logToConsole("PlacePiece(board, 1, 1, 'O') → true", 'green');
    logToConsole("PlacePiece(board, 2, 3, 'X') → true", 'green');
    logToConsole("PlacePiece(board, 2, 2, 'O') → true", 'green');
    logToConsole("PlacePiece(board, 0, 3, 'X') → true", 'green');
    const pos = findPieceOnBoard(board, 'O');
    logToConsole(`FindPiece(board, 'O') → (${pos.row}, ${pos.col})`, 'yellow');
    logToConsole("", 'white');
    logToConsole("=== DEL B: Highscores ===", 'white');
    const sorted = sortHighscores(scores);
    logToConsole(`Sorterad: [${sorted.join(', ')}]`, 'accent');
    logToConsole(`Rank för 2100: #${findRank(sorted, 2100)}`, 'yellow');
    const stats = calculateStats(scores);
    logToConsole(`Stats: Min=${stats.min}, Max=${stats.max}, Medel=${stats.average.toFixed(1)}`, 'green');
}

init();