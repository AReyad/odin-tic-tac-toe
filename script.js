function createPlayer(name, marker) {
    let movesCount = 0;

    const increaseMovesCount = () => movesCount++;
    const getMovesCount = () => movesCount;
    return { name, marker, increaseMovesCount, getMovesCount };
};

const board = (size) => (() => {
    let board = new Array(size);
    
    const emptyCell = (cell) => {
        return typeof board[cell] == 'undefined'
    };

    const assignMove = (index, marker) => {
        if (!emptyCell(index)) throw new Error("Cell is occupied");
            
        board[index] = marker;
    };

    const isFull = () => {
        for (let i = 0; i < board.length; i++) {
            if (emptyCell(i)) return false
        };
        return true;
    };

    const getCells = () => { return board.slice(0) }

    return { assignMove, isFull, getCells};
})();

function game(playerOneName, playerTwoName) {
    const boardCellsCount = 9;
    const gameBoard = board(boardCellsCount);
    const player1 = createPlayer(playerOneName, "x");
    const player2 = createPlayer(playerTwoName, "o");
    const winningCord = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
    let gameStatus = { gameOver: false };

    const swapTurn = () => {
        currentPlayer = otherPlayer();
    };
    
    const otherPlayer = () => {
        return currentPlayer == player1 ? player2 : player1;
    };

    const randomizeFirstTurn = () => {
        return Math.floor(Math.random() * 2) == 0 ? player1 : player2
    };

    let currentPlayer = randomizeFirstTurn();

    const makePlay = (move) => {
        if (gameStatus.gameOver) return;
        gameBoard.assignMove(move, currentPlayer.marker);
        currentPlayer.increaseMovesCount();
        swapTurn();
        isGameOver();
    };

    const isTie = () => {
        return gameBoard.isFull();
    };

    const isWinner = (board, player) => {
        if(player.getMovesCount() < 3) return false;
        let points = 0;
        for(let i = 0; i < winningCord.length; i++) {
            for(let j = 0; j < winningCord[i].length; j++) {
                if(board[winningCord[i][j]] == player.marker) {
                    points++
                    if(points == 3) return true;
                }
            }
        points = 0;
        };
        return false;
    };

    const isGameOver = () => {
        if (isWinner(gameBoard.getCells(), otherPlayer())) {
            return gameStatus = { gameOver: true, winner: otherPlayer()};
        } else if(isTie()) {
            return gameStatus = { gameOver: true, winner: null};
        };
    };

    const getWinner = () => gameStatus.winner;
    const getGameStatus = () => gameStatus.gameOver;
    const getCurrentPlayerProperty = (property) => currentPlayer[property];
    const getOtherPlayerProperty = (property) => otherPlayer()[property];


    return { makePlay, getWinner, getGameStatus, getCurrentPlayerProperty, getOtherPlayerProperty};
};

const gameDisplayController = (() => {
    const boardEle = document.querySelector(".board");
    let currentGame = game("player1", "player2");
    const gameStatusEle = document.querySelector(".game-status")
    const playerTurnEle = document.querySelector(".player-turn")

    const createCells = () => { 
        for(let i = 0; i < 9; i++) {
        const cellElement = document.createElement("div")
        cellElement.classList.add("cell")
        boardEle.append(cellElement)
    }}

    const playTurn = (cell, index) => {
        if(currentGame.getGameStatus()) return;
        currentGame.makePlay(index)
        cell.textContent = currentGame.getOtherPlayerProperty("marker")
        displayPlayerTurn()
        if(currentGame.getGameStatus()) return displayGameStatus();
    }

    const displayPlayerTurn = () => {
        playerTurnEle.textContent = `${currentGame.getCurrentPlayerProperty("name")}(${currentGame.getCurrentPlayerProperty("marker")})'s turn`
    }

    const displayGameStatus = () => {
        if(!currentGame.getGameStatus()) return;
        playerTurnEle.textContent = "";
        const gameStatusPara = document.createElement("p")
        gameStatusPara.classList.add("status-para")
        gameStatusEle.append(gameStatusPara)
        const winner = currentGame.getWinner()
        displayRestartBtn()
        if(winner) return gameStatusPara.textContent = `${winner.name} (${winner.marker}) has won!`;
        return gameStatusPara.textContent = "Draw!";
    }

    const displayRestartBtn = () => {
        const restartBtn = document.createElement("button")
        restartBtn.textContent = "Restart game"
        restartBtn.addEventListener('click', restartGame)
        document.querySelector("main").append(restartBtn)
    }

    const startGame = () => {
        displayPlayerTurn()
        createCells()
        const cellElements = document.querySelectorAll(".cell")
        cellElements.forEach((cell, index) => {
        cell.classList.add(index)
        cell.addEventListener('click', () => playTurn(cell, index))
    })};

    const restartGame = () => {
        boardEle.textContent = "";
        document.querySelector(".status-para").remove()
        document.querySelector("button").remove()
        currentGame = game("player1", "player2")
        startGame()
    }

    return { startGame, restartGame }
})();


gameDisplayController.startGame()