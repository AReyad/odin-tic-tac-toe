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