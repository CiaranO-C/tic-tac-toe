function createPlayer(name) {
    let score = 0;
    let marker = '';

    const playerName = name;

    const getName = () => console.log(playerName);

    const setMarker = (choice) => {
        if (!marker) {
            marker = choice;
        };
    };

    const getMarker = () => console.log(marker);

    const win = () => score++;

    const getScore = () => console.log(score);

    return { getName, getMarker, setMarker, win, getScore };
};

const gameBoard = (() => {
    const board = [];
    const rows = 3;
    const cols = 3;

    const generateBoard = () => {
        for (let i = 0; i < rows; i++) {
            board.push([]);
            for (let j = 0; j < cols; j++) {
                board[i].push('');
            };
        };
        return board;
    };

    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                board[i][j] = '';
            };
        };
    };

    const updateBoard = (row, col, marker) => {
        board[row][col] = marker;
    };

    const checkWinner = () => {
        let winner = false;

        function checkRows() {
            for (let i = 0; i < rows; i++) {
                const marker = board[i][0];

                if (board[i].every(elem => elem === marker)) {
                    winner = true;
                    return;
                };
            };
        };

        function checkCols() {
            for (let j = 0; j < cols; j++) {
                const marker = board[0][j];
                for (let i = 0; i < rows; i++) {
                    if (board[i][j] !== marker) {
                        return;
                    } else if (i === 2) {
                        winner = true;
                        return;
                    };
                };
            };
        };

        function checkDiag() {
            const marker = board[1][1];

            for(let i = 0; i<3; i++){
                const j = i;

                if(board[i][j] !== marker) {
                    return;
                } else if(i === 2) {
                    winner = true;
                    return;
                };
            };

            for(let i = 0; i<3; i++){
                let j = 2-i;
                
                if(board[i][j] !== marker) {
                    return;
                } else if(i === 2) {
                    winner = true;
                    return;
                };
            };
        };

        function hasWon() {
            return winner;
        }

        checkRows();
        checkCols();
        checkDiag();

        return hasWon();
    };

    return {generateBoard, clearBoard, updateBoard, checkWinner};
})();


const playerOne = createPlayer(prompt('Player 1 Enter Name:'));
const playerTwo = createPlayer(prompt('Player 2 Enter Name:'));

console.log(generateBoard);

