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
        marker = choice;
        if (choice === 'x') {
            turn = true;
        } else {
            turn = false;
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
    function current() {
        if (one.isTurn()) {
            return one;
        } else {
            return two;
        };
    };

    function switchTurn() {
        if (one.isTurn()) {
            one.setTurn(false);
            two.setTurn(true);
        } else {
            two.setTurn(false);
            one.setTurn(true);
        };
    };

    return { one, two, current, switchTurn };
})();

const gameBoard = (() => {
    const board = [];
    const rows = 3;
    const cols = 3;
    let winner = false;
    let draw = false;
    let moveCount = 1;

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
            moveCount = 1
        };
    };

    const updateBoard = (index) => {
        const marker = players.current().getMarker();
        i = index[0];
        j = index[1];

        if (i > 2 || j > 2 || board[i][j]) {
            console.log('Please enter valid co-ords!')
        } else {
            board[i][j] = marker;
        };
        if (gameBoard.totalMoves().count() > 4) {
            checkWin();
        };
    };

    const checkWin = () => {
        function checkRows() {
            for (let i = 0; i < rows; i++) {
                const marker = board[i][0];
                if (!marker) continue;
                if (board[i].every(elem => elem === marker)) {
                    winner = true;
                    players.current().addPoint();
                    return;
                };
            };
        };

        function checkCols() {
            for (let j = 0; j < cols; j++) {
                const marker = board[0][j];
                if (!marker) continue;

                let columnWin = true; // Assume win for each column
                for (let i = 1; i < rows; i++) {
                    if (board[i][j] !== marker) {
                        columnWin = false;
                        break;
                    }
                }
                if (columnWin) {
                    winner = true;
                    players.current().addPoint();
                    return; // Exit function if win detected
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
                    };
                };
                winner = true;
                players.current().addPoint();
                return;
            };

            function diagTwo() {
                if (!marker) return;
                for (let i = 0; i < 3; i++) {
                    let j = 2 - i;

                    if (board[i][j] !== marker) {
                        return;
                    };
                };
                winner = true;
                players.current().addPoint();
                return;
            };
            diagOne();
            diagTwo();
        };

        checkRows();
        checkCols();
        checkDiag();

        if (moveCount === 9 && !winner) {
            draw = true;
        };

        if (winner) {
            display.points().add();
        };
    };

    const isEnd = () => winner || draw;
    const getWin = () => winner;
    const getDraw = () => draw;

    const totalMoves = () => {
        const add = () => moveCount++;
        const count = () => moveCount;
        const reset = () => moveCount = 1;
        return { add, count, reset };
    };

    return {generateBoard, updateBoard, isEnd, getWin, getDraw, totalMoves };
})();

const display = (() => {
    const boardContainer = document.querySelector('.boardContainer');
    const resetButton = document.querySelector('#resetBtn');
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    const playButton = document.querySelector('.play');
    const nameInputs = document.querySelectorAll('input[type="text"]');
    const footer = document.querySelector('footer');
    const yes = document.createElement('button');
    yes.textContent = 'Yes';
    const no = document.createElement('button');
    no.textContent = 'No';

    const generateBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('button');
                cell.setAttribute('index', `${i}${j}`);
                cell.classList.add('cell');
                boardContainer.appendChild(cell);
            };
        };
    };

    const clearBoard = () => {
        while (boardContainer.firstChild) {
            boardContainer.firstChild.remove();
        };
    };
   
    const disableBoard = () => {
        for (const cell of boardContainer.children) {
            cell.replaceWith(cell.cloneNode(true));
        };
    };

    const updateCell = (cell) => {
        const marker = document.createElement('img');
        if (players.current().getMarker() === 'x') {
            marker.src = "./images/x.png";
        } else {
            marker.src = "./images/o.png";
        };

        //checks if cell already contains a move, flashes red if invalid
        if (!cell.firstChild) {
            cell.appendChild(marker);
            gameBoard.updateBoard(cell.getAttribute('index'));
            gameBoard.totalMoves().add();
            players.switchTurn();
            updateDialog();
        } else {
            cell.id = 'invalidMove';
            setTimeout(() => {
                cell.id = '';
            }, 200);
        };
    };

    const resetGame = () => {
        points().clear();
        clearBoard();
        generateBoard();
        enableForms();
        slider().reset();
        gameBoard.generateBoard('clear');
        updateDialog('reset');
    };

    const getForms = () => {
        const formOne = new FormData(playerOneForm);
        const formTwo = new FormData(playerTwoForm);
        const nameOne = formOne.get('name');
        const nameTwo = formTwo.get('name');
        const markerOne = formOne.get('marker');
        const markerTwo = formTwo.get('marker');

        disableForms();

        return { nameOne, nameTwo, markerOne, markerTwo };
    };

    const disableForms = () => {
        nameInputs.forEach(input => input.readOnly = true);
        radioInputs.forEach(input => input.disabled = true);
    };

    const enableForms = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
        nameInputs.forEach(input => input.readOnly = false);
        radioInputs.forEach(input => input.disabled = false);
    };

    const changeRadio = (input) => {
        const id = input.id;
        switch (id) {
            case 'xOne':
                document.querySelector('#oTwo').checked = true;
                break;
            case 'oOne':
                document.querySelector('#xTwo').checked = true;
                break;
            case 'xTwo':
                document.querySelector('#oOne').checked = true;
                break;
            default:
                document.querySelector('#xOne').checked = true;
                break;
        };
    };

    const slider = () => {
        const dotOne = document.querySelector('#dotOne');
        const dotTwo = document.querySelector('#dotTwo');

        const move = () => {
            dotOne.classList.toggle('o');
            dotTwo.classList.toggle('o');
        };

        const reset = () => {
            dotOne.classList.toggle('o', false);
            dotTwo.classList.toggle('o', true);
        };

        return { move, reset };
    };

    const applyListeners = () => {

        const playListener = () => {
            playButton.addEventListener('click', () => {
                duringGame();
                playButton.remove();
                gameControl.startGame();
            });
        };

        const cellListener = () => {
            for (const cell of boardContainer.children) {
                cell.addEventListener('click', () => {
                    updateCell(cell);
                });
            };
        };

        const resetListener = () => {
            resetButton.addEventListener('click', () => {
                resetGame();
            });

            no.addEventListener('click', () => {
                resetGame();
            });
        };

        const radioListeners = () => {
            radioInputs.forEach(input => {
                input.addEventListener('change', () => {
                    slider().move();
                    changeRadio(input);
                });
            });
        };

        const preGame = () => {
            radioListeners();
            playListener();
        };

        const duringGame = () => {
            cellListener();
            resetListener();
            playAgain();
        }

        const playAgain = () => {
            yes.addEventListener('click', () => {
                clearBoard();
                generateBoard();
                cellListener();
                gameBoard.generateBoard('clear');
                updateDialog();
            })
        }

        return { cellListener, resetListener, radioListeners, preGame, duringGame, playAgain }
    };

    const updateDialog = (reset = false) => {
        const message = document.createElement('span');
        removeMessage();

        if (!reset) {
            if (gameBoard.getWin()) {
                players.switchTurn(); // switch turn back to winning player
                message.textContent = `${players.current().getName()} Wins!`;
            } else if (gameBoard.getDraw()) {
                message.textContent = 'Its a draw!';
            } else {
                message.textContent = `${players.current().getName()}'s turn!`;
            };
            footer.appendChild(message);
        } else {
            footer.appendChild(playButton);
        };

        if (gameBoard.isEnd()) {
            disableBoard();

            setTimeout(() => {
                removeMessage();
                message.textContent = 'Play Again?';
                footer.append(message, yes, no);
            }, 2000);
        };
    };

    const removeMessage = () => {
        while (footer.firstChild) {
            footer.removeChild(footer.firstChild);
        };
    };

    const points = () => {
        const add = () => {
            let container;
            const player = players.current();
            if (player === players.one) {
                container = document.querySelector('#cardOne').lastElementChild;
            } else {
                container = document.querySelector('#cardTwo').lastElementChild;
            };
            const point = document.createElement('div');
            point.classList.add('point');
            container.appendChild(point);
        };

        const clear = () => {
            const containers = document.querySelectorAll('.pointContainer');
            containers.forEach(cont => {
                while(cont.firstChild){
                    cont.removeChild(cont.firstChild);
                };
            });
        };

        return { add, clear };
    };

    return { generateBoard, applyListeners, getForms, updateDialog, points};
})();

const gameControl = (() => {

    gameBoard.generateBoard();

    display.generateBoard();

    display.applyListeners().preGame();


    const playerOne = players.one;
    const playerTwo = players.two;


    function startGame() {
        const playerInfo = display.getForms();
        playerOne.setName(playerInfo.nameOne);
        playerTwo.setName(playerInfo.nameTwo);
        playerOne.setMarker(playerInfo.markerOne);
        playerTwo.setMarker(playerInfo.markerTwo);

        display.updateDialog();
    };

    return { startGame, }
})();