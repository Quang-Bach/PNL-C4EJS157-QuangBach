document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const startBtn = document.getElementById('startBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const winMessage = document.getElementById('winMessage');
    const historyTable = document.getElementById('historyTable');
  
    let board = [];
    let blackTilePos = { row: 2, col: 2 };
    let timerInterval;
    let seconds = 0;
    let moves = 0;
    let gameStarted = false;
    let gameHistory = [];
  
    const winningState = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, null]
    ];
  
    const colors = {
      1: 'bg-green-200 text-green-500',
      2: 'bg-pink-200           text-red-500',
      3: 'bg-blue-200       text-blue-500',
      4: 'bg-purple-200         text-purple-500',
      5: 'bg-blue-300           text-pink-500',
      6: 'bg-yellow-200         text-yellow-500',
      7: 'bg-indigo-200          text-indigo-500',
      8: 'bg-green-300       text-gray-500',
      9: 'bg-yellow-200           text-emerald-500',
      10: 'bg-amber-200         text-amber-500',
      11: 'bg-red-200            text-lime-500',
      null: 'bg-black'
    };
  
    function initBoard() {
      board = [
        [1, 2, 3, 4],
        [11, 5, 6, 8],
        [9, 7, null, 10]
      ];
      blackTilePos = { row: 2, col: 2 };
      renderBoard();
    }
  
    function renderBoard() {
      gameBoard.innerHTML = '';
      board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const tile = document.createElement('div');
          tile.className = `w-32 h-32 flex items-center justify-center text-3xl font-bold border border-gray-300 rounded ${colors[cell]}`
          tile.textContent = cell || '';
          gameBoard.appendChild(tile);
        });
      });
    }
  
    function startTimer() {
      clearInterval(timerInterval);
      seconds = 0;
      timerDisplay.textContent = '00:00';
      timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
      }, 1000);
    }
  
    function stopTimer() {
      clearInterval(timerInterval);
    }
  
    function shuffleBoard() {
      for (let i = 0; i < 100; i++) {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * 4)];
        moveTile(randomDirection, true);
      }
      moves = 0;
    }
  
    function moveTile(direction, isShuffle = false) {
      let newRow = blackTilePos.row;
      let newCol = blackTilePos.col;
  
      if (direction === 'up') newRow--;
      else if (direction === 'down') newRow++;
      else if (direction === 'left') newCol--;
      else if (direction === 'right') newCol++;
  
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 4) {
        board[blackTilePos.row][blackTilePos.col] = board[newRow][newCol];
        board[newRow][newCol] = null;
        blackTilePos = { row: newRow, col: newCol };
        if (!isShuffle) moves++;
        renderBoard();
        if (!isShuffle) checkWin();
      }
    }
  
    function checkWin() {
      if (JSON.stringify(board) === JSON.stringify(winningState)) {
        stopTimer();
        winMessage.classList.remove('hidden');
        startBtn.classList.add('hidden');
        playAgainBtn.classList.remove('hidden');
        gameStarted = false;
        gameHistory.push({ moves, time: timerDisplay.textContent });
        renderHistory();
      }
    }
  
    function renderHistory() {
      historyTable.innerHTML = '';
      gameHistory.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>#${index + 1}</td>
          <td>${entry.moves}</td>
          <td>${entry.time}</td>
        `;
        historyTable.appendChild(row);
      });
    }
  
    startBtn.addEventListener('click', () => {
      if (!gameStarted) {
        shuffleBoard();
        startTimer();
        startBtn.textContent = 'Kết thúc';
        gameStarted = true;
        winMessage.classList.add('hidden');
        playAgainBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
      } else {
        initBoard();
        stopTimer();
        startBtn.textContent = 'Bắt đầu';
        gameStarted = false;
      }
    });
  
    playAgainBtn.addEventListener('click', () => {
      shuffleBoard();
      startTimer();
      winMessage.classList.add('hidden');
      playAgainBtn.classList.add('hidden');
      startBtn.classList.remove('hidden');
      startBtn.textContent = 'Kết thúc';
      gameStarted = true;
    });
  
    document.addEventListener('keydown', (e) => {
      if (!gameStarted) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') moveTile('up');
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') moveTile('down');
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveTile('left');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveTile('right');
    });
  
    initBoard();
  });