const {
    Board,
    BoardStateEnum,
    CellFlagEnum,
    CellStateEnum,
    generateMineArray,
} = minesweeper;

const restartElement = document.querySelector('.restart');
const containerElement = document.querySelector('.container');

const mineArray = generateMineArray({
    rows: 8,
    cols: 10,
    mines: 10,
});

let board = new Board(mineArray);

const rows = Array.from({ length: board.numRows() }, (_, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    containerElement.appendChild(rowElement);

    return {
        element: rowElement,
        cells: Array.from({ length: board.numCols() }, (_, cellIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.x = cellIndex;
            cellElement.dataset.y = rowIndex;

            rowElement.appendChild(cellElement);

            return cellElement;
        }),
    };
});

const renderGrid = () => {
    const grid = board.grid();

    rows.forEach(({ cells }, rowIndex) => {
        cells.forEach((cell, cellIndex) => {
            const item = grid[rowIndex][cellIndex];
            if (item.state === CellStateEnum.OPEN) {
                if (item.isMine) {
                    cell.textContent = '💣';
                    cell.classList.add('mine');
                } else {
                    cell.textContent = item.numAdjacentMines;
                }
            } else if (item.state === CellStateEnum.CLOSED) {
                if (item.flag === CellFlagEnum.NONE) {
                    cell.textContent = '';
                } else if (item.flag === CellFlagEnum.EXCLAMATION) {
                    cell.textContent = '!';
                } else if (item.flag === CellFlagEnum.QUESTION) {
                    cell.textContent = '?';
                }
            }
        });
    });

    requestAnimationFrame(renderGrid);
};

requestAnimationFrame(renderGrid);

document.body.addEventListener('click', event => {
    if (event.target.closest('.cell')) {
        board.openCell(
            Number(event.target.dataset.x),
            Number(event.target.dataset.y),
        );
    }
});

document.body.addEventListener('contextmenu', event => {
    if (event.target.closest('.cell')) {
        event.preventDefault();
        board.cycleCellFlag(
            Number(event.target.dataset.x),
            Number(event.target.dataset.y),
        );
    }
});

restartElement.addEventListener('click', () => {
    const mineArray = generateMineArray({
        rows: 8,
        cols: 10,
        mines: 10,
    });

    board = new Board(mineArray);
});
