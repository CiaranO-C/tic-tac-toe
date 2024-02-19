function createPlayer() {
    let score = 0;
    let marker;
    let turn;
    let playerName;

    const setName = (name) => {
        if (/^[0-9A-Za-z]+$/.test(name)) {
            playerName = name;
        } else {
            console.log('Only letter and numbers allowed!');
        };
    };

    const getName = () => playerName;

    const setMarker = (choice) => {
        const choiceCaps = choice.toUpperCase();
        if (!marker && choiceCaps === 'X' || choiceCaps === 'O') {
            marker = choiceCaps;
            (marker === 'X') ? turn = true : turn = false;
        } else if (marker) {
            console.log(`${playerName} is already ${marker}!`);
        } else {
            console.log('Whoops! Try again, enter either X or O!');
        };
    };

    const getMarker = () => marker;

    const win = () => score++;

    const getScore = () => console.log(score);

    const isTurn = () => turn;

    const setTurn = (bool) => turn = bool;

    return { setName, getName, getMarker, setMarker, win, getScore, isTurn, setTurn };
};

const gameBoard = (() => {
    const board = [];
    const rows = 3;
    const cols = 3;
    let winner = false;

    const hasWon = () => winner;

    const generateBoard = () => {
        for (let i = 0; i < rows; i++) {
            board.push([]);
            for (let j = 0; j < cols; j++) {
                board[i].push('');
            };
        };
        return board;
    };

    const getBoard = () => {
        return board;
    };

    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                board[i][j] = '';
            };
        };
    };

    const updateBoard = (i, j, marker) => {
        if (i > 2 || j > 2 || board[i][j]) {
            console.log('Please enter valid co-ords!')
        } else {
            board[i][j] = marker;
        };
    };

    const validateMove = (i, j) => {
        console.log(i);
        console.log(j);
        if (i > 2 || j > 2) {
            console.log('Please enter valid co-ords!')
            return false;
        } else {
            return true;
        };
    }

    const checkWinner = () => {
        function checkRows() {
            for (let i = 0; i < rows; i++) {
                const marker = board[i][0];
                if (!marker) return;
                if (board[i].every(elem => elem === marker)) {
                    winner = true;
                    return;
                };
            };
        };

        function checkCols() {
            for (let j = 0; j < cols; j++) {
                const marker = board[0][j];
                if (!marker) return;
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
            if (!marker) return;
            for (let i = 0; i < 3; i++) {
                const j = i;

                if (board[i][j] !== marker) {
                    return;
                } else if (i === 2) {
                    winner = true;
                    return;
                };
            };

            for (let i = 0; i < 3; i++) {
                let j = 2 - i;

                if (board[i][j] !== marker) {
                    return;
                } else if (i === 2) {
                    winner = true;
                    return;
                };
            };
        };

        checkRows();
        checkCols();
        checkDiag();
    };

    return { hasWon, getBoard, generateBoard, clearBoard, updateBoard, validateMove, checkWinner };
})();


const gameControl = () => {

    const playerOne = createPlayer();

    playerOne.setName('Harvey');

    console.log(`Hello, ${playerOne.getName()}!`);

    playerOne.setMarker('X');
    console.log(`${playerOne.getName()} has chosen ${playerOne.getMarker()}!`);

    const playerTwo = createPlayer();
    playerTwo.setName('Wilbur');
    console.log(`Hello, ${playerTwo.getName()}!`);
    if (playerOne.getMarker() === 'X') {
        playerTwo.setMarker('O');
    } else {
        playerTwo.setMarker('X');
    };
    console.log(`${playerTwo.getName()}'s marker is ${playerTwo.getMarker()}!`);

    gameBoard.generateBoard();

    let moveCount = 1;
    function switchPlayer() {
        if (playerOne.isTurn()) {
            playerOne.setTurn(false);
            playerTwo.setTurn(true);
        } else {
            playerTwo.setTurn(false);
            playerOne.setTurn(true);
        };
    };

    function currentPlayer() {
        if (playerOne.isTurn()) {
            return playerOne
        } else {
            return playerTwo
        };
    };

    let row;
    let col;
    function getMove() {
        row = prompt('Enter Row');
        col = prompt('Enter Column');
    };

    console.log('Let the game begin!');
    console.table(gameBoard.getBoard());

    while (!gameBoard.hasWon()) {
        getMove();

        if (gameBoard.validateMove(row, col)) {
            gameBoard.updateBoard(row, col, currentPlayer().getMarker());
        };

        console.table(gameBoard.getBoard());

        if (moveCount > 4) {
            gameBoard.checkWinner();
        }

        moveCount++;
        switchPlayer();
    };
};


gameControl();

/*
game controller

loop until winner=true
get move (player1 || player2)
updateBoard()
totalMoves++ 
if(totalMoves > 4){
    checkWinner
}
swap values at end of turn
*/