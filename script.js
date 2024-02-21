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
    const addPoint = () => score++;
    const getScore = () => score;
    const setTurn = (bool) => turn = bool;
    const resetScore = () => score = 0;
    const isTurn = () => turn;

    return { setName, getName, setMarker, getMarker, addPoint, getScore, resetScore, setTurn, isTurn };
};

const players = (() => {
    const one = createPlayer();
    const two = createPlayer();

    //All methods relating to both players
    function currentPlayer() {
        if (one.isTurn()) {
            return one;
        } else {
            return two;
        };
    };

    return { one, two, currentPlayer};
})();

const gameBoard = (() => {
    const board = [];
    const rows = 3;
    const cols = 3;
    let winner = false;
    let draw = false;

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
            draw = false;
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
    };

    const checkWin = () => {
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

    const isEnd = () => winner || draw;
    const getWin = () => winner;
    const setDraw = (bool) => draw = bool;

    return { generateBoard, getBoard, updateBoard, validateMove, checkWin, isEnd, getWin, setDraw };
})();


const gameControl = () => {
    gameBoard.generateBoard();
    display.generateBoard();

    const playerOne = players.one;
    const playerTwo = players.two;

    //play button function call goes here right before getNames
    const names = display.getNames;

    playerOne.setName(names().nameOne);
    playerTwo.setName(names().nameTwo);

    console.log(playerOne.getName());
    console.log(players.two.getName());

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

    //setMarkers();




    function switchTurn() {
        if (playerOne.isTurn()) {
            playerOne.setTurn(false);
            playerTwo.setTurn(true);
        } else {
            playerTwo.setTurn(false);
            playerOne.setTurn(true);
        };
    };

    

    let row;
    let col;
    function getMove() {
        // row = prompt('Enter Row');
        // col = prompt('Enter Column');
    };

    console.log('Let the game begin!');

    // playGame();

    function playGame() {

        console.table(gameBoard.getBoard());
        let moveCount = 1;

        while (!gameBoard.isEnd()) {

            do {
                getMove();
            } while (!gameBoard.validateMove(row, col));

            gameBoard.updateBoard(row, col, players.currentPlayer()().getMarker());

            console.table(gameBoard.getBoard());

            if (moveCount > 4) {
                gameBoard.checkWin();
                if (moveCount === 9 && !gameBoard.isEnd()) {
                    gameBoard.setDraw(true);
                };
            };

            moveCount++;
            switchTurn();
        };

    };

    function gameResult() {
        if (gameBoard.getWin()) {
            //set turn back to winning player
            switchTurn();

            if (playerOne.isTurn()) {
                console.log(`${playerOne.getName()} Wins!!!`);
                playerOne.addPoint();
            } else {
                console.log(`${playerTwo.getName()} Wins!!!`);
                playerTwo.addPoint();
            };
            //game over and win is false, must be draw
        } else {
            console.log(`It's a draw!`);
        };
    };



    function printScores() {
        console.log(`*---*  ${playerOne.getName()}'s score: ${playerOne.getScore()}  *---*`);
        console.log(`*---*  ${playerTwo.getName()}'s score: ${playerTwo.getScore()}  *---*`);
    };

    // gameResult();
    // printScores();
    // playAgain();
    function playAgain() {
        let again = confirm('Play Again???');
        while (again) {
            setMarkers();

            gameBoard.generateBoard('clear');

            console.log(`Let round ${playerOne.getScore() + playerTwo.getScore() + 1} begin!`);

            playGame();
            gameResult();
            printScores();

            again = confirm('Play Again???');
        };

        console.log('Thanks for playing!');
    };
};

const display = (() => {

    const boardContainer = document.querySelector('.boardContainer');
    let board = [];

    const updateBoard = (event) => {
        const cell = event.target;
        const marker = document.createElement('img');
        if(players.)
    };

    const generateBoard = () => {
        board = gameBoard.getBoard();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('button');
                cell.setAttribute('index', `${i}${j}`);
                cell.classList.add('cell');
                boardContainer.appendChild(cell);
            };
        };

        boardContainer.addEventListener('click', (e) => {
            updateBoard(e);
        });
    };


    const getNames = () => {
        const nameOne = document.querySelector('#playerOne').value;
        const nameTwo = document.querySelector('#playerTwo').value;
        return { nameOne, nameTwo };
    };

    // const getMarkers = () => {
    //     const markerOne = document.querySelector(#)
    //  }

    return { generateBoard, getNames, };
})();


gameControl();


