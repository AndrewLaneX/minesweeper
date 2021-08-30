const {
    Board,
    BoardStateEnum,
    CellFlagEnum,
    CellStateEnum,
    generateMineArray,
} = minesweeper;

const containerElement = document.querySelector('.container');
const statusElement = document.querySelector('.status');
const restartElement = document.querySelector('.restart');

let board = new Board(
    generateMineArray({
        rows: 8,
        cols: 10,
        mines: 10,
    }),
);

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
                    cell.textContent = item.numAdjacentMines || '';
                    cell.classList.add('open');
                }
            } else if (item.state === CellStateEnum.CLOSED) {
                if (item.flag === CellFlagEnum.NONE) {
                    cell.textContent = '';
                    cell.classList.remove('flag', 'flag-e', 'flag-q');
                } else if (item.flag === CellFlagEnum.EXCLAMATION) {
                    cell.textContent = '🏴!';
                    cell.classList.add('flag', 'flag-e');
                } else if (item.flag === CellFlagEnum.QUESTION) {
                    cell.textContent = '🏴?';
                    cell.classList.add('flag', 'flag-q');
                }
            }
        });
    });

    switch (board.state()) {
        case BoardStateEnum.PRISTINE:
        case BoardStateEnum.IN_PROGRESS:
        default:
            statusElement.textContent = '';
            break;

        case BoardStateEnum.LOST:
            statusElement.textContent = 'you lost';
            break;

        case BoardStateEnum.WON:
            statusElement.textContent = 'you won';
            break;
    }

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
    board = new Board(
        generateMineArray({
            rows: 8,
            cols: 10,
            mines: 10,
        }),
    );

    document
        .querySelectorAll('.cell')
        .forEach(cell =>
            cell.classList.remove('mine', 'flag', 'flag-e', 'flag-q', 'open'),
        );
});
