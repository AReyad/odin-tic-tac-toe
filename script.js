function createPlayer(name, marker) {
    return { name, marker };
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
    const boardCellsCount = 9
    const gameBoard = board(boardCellsCount)
    const player1 = createPlayer(playerOneName, "x")
    const player2 = createPlayer(playerTwoName, "o")
    let gameOver = false

    const swapTurn = () => {
        currentPlayer = currentPlayer == player1 ? player2 : player1
    }

    const randomizeFirstTurn = () => {
        return Math.floor(Math.random() * 2) == 0 ? player1 : player2
    }

    let currentPlayer = randomizeFirstTurn()

    const makePlay = (move) => {
        gameBoard.assignMove(move, currentPlayer.marker)
        if (gameOver) return;
        swapTurn()
        return gameBoard.getCells()
    };

    return { makePlay };
};

