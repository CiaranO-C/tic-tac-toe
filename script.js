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
        if (choiceCaps === 'X' || choiceCaps === 'O') {
            marker = choiceCaps;
            (marker === 'X') ? turn = true : turn = false;
        } else {
            console.log('Whoops! Try again, enter either X or O!');
        };
    };

    const getMarker = () => marker;

    const win = () => score++;

    const getScore = () => score;

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

    const generateBoard = (shouldClear = false) => {
        //either generates intial board, or clears existing board
        if (!shouldClear) {
            for (let i = 0; i < rows; i++) {
                board.push([]);
                for (let j = 0; j < cols; j++) {
                    board[i].push('');
                };
            };
        } else {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    board[i][j] = '';
                };
            };
            winner = false;
        };
        return board;
    };

    const getBoard = () => {
        return board;
    };

    const updateBoard = (i, j, marker) => {
        if (i > 2 || j > 2 || board[i][j]) {
            console.log('Please enter valid co-ords!')
        } else {
            board[i][j] = marker;
        };
    };

    const validateMove = (i, j) => {
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

            function diagOne() {
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
            };

            function diagTwo() {
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
            diagOne();
            diagTwo();
        };

        checkRows();
        checkCols();
        checkDiag();
    };

    return { hasWon, getBoard, generateBoard, updateBoard, validateMove, checkWinner };
})();


const gameControl = () => {
    const playerOne = createPlayer();
    const playerTwo = createPlayer();

    function setNames(player, name) {
        player.setName(name);
        console.log(`Hello, ${player.getName()}!`);
    }

    setNames(playerOne, 'Beep');
    setNames(playerTwo, 'Boop');

    function setMarkers() {
        //if player one has no marker, must be first round
        if (!playerOne.getMarker()) {
            playerOne.setMarker('X');
            console.log(`${playerOne.getName()} has chosen ${playerOne.getMarker()}!`);

            if (playerOne.getMarker() === 'X') {
                playerTwo.setMarker('O');
            } else {
                playerTwo.setMarker('X');
            };
            console.log(`${playerTwo.getName()}'s marker is ${playerTwo.getMarker()}!`);

            //play again selected 
        } else {
            const shouldChange = confirm('Would you like to change markers?');
            if (shouldChange) {
                const token = playerOne.getMarker();
                playerOne.setMarker(playerTwo.getMarker());
                playerTwo.setMarker(token);
                console.log(`You swapped markers! ${playerOne.getName()} is now ${playerOne.getMarker()}... and ${playerTwo.getName()} is ${playerTwo.getMarker()}!`);
            };
        };
    };

    setMarkers();

    gameBoard.generateBoard();


    function switchTurn() {
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

    playGame();

    function playGame() {

        console.table(gameBoard.getBoard());
        let moveCount = 1;

        while (!gameBoard.hasWon()) {

            do {
                getMove();
            } while (!gameBoard.validateMove(row, col));

            gameBoard.updateBoard(row, col, currentPlayer().getMarker());

            console.table(gameBoard.getBoard());

            if (moveCount > 4) {
                gameBoard.checkWinner();
            }

            moveCount++;
            switchTurn();
        };

    };

    function winsScores() {
        //set turn back to winning player
        switchTurn();


        if (playerOne.isTurn()) {
            console.log(`${playerOne.getName()} Wins!!!`);
            playerOne.win();
        } else {
            console.log(`${playerTwo.getName()} Wins!!!`);
            playerTwo.win();
        };

        console.log(`*---*  ${playerOne.getName()}'s score: ${playerOne.getScore()}  *---*`);
        console.log(`*---*  ${playerTwo.getName()}'s score: ${playerTwo.getScore()}  *---*`);
    };

    winsScores();

    let again = confirm('Play Again???');
    while (again) {
        setMarkers();

        gameBoard.generateBoard('clear');

        console.log(`Let round ${playerOne.getScore() + playerTwo.getScore() + 1} begin!`)

        playGame();
        winsScores();

        again = confirm('Play Again???');
    };

    console.log('Thanks for playing!');
};


gameControl();

