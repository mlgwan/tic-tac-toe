

const gameBoard = (function(){
    let board = [];
    const boardSize = 9;
    const boardWidth = Math.sqrt(boardSize);
    let emptyFields;

    const boardElement = Array.from(document.getElementById("board").children);

    const getBoard = ()=> board;

    const setBoard = (value, position) => board[position] = value;

    const render = () =>{
        board.forEach((value, index)=>{
             boardElement[index].children[0].textContent = value;
        })
    }

    const checkForGameOver = ()=>{
        if(checkRows(board) || checkColumns(board) || checkDiagonals(board)){
            return "win";
        }
        else if (emptyFields === 0){
            return "draw";
        }
    }

    const checkRows = board=>{
        for (let i = 0; i < boardSize; i+=boardWidth){
            if (board[i] !== "" && board[i] === board[i+1] && board[i] === board[i+2]){
                return true;
            }
        }
        return false;   
    }

    const checkColumns = board=>{
        for (let i = 0; i < boardWidth; i++){
            if (board[i] !== "" && board[i] === board[i+boardWidth] && board[i] === board[i+2*boardWidth]){
                return true;
            }
        }
        return false;
    }

    const checkDiagonals = board=>{
        if ((board[0] !== "" && board[0] === board[boardWidth+1] && board[0] === board[2*(boardWidth+1)]) ||
            (board[boardWidth-1] !== "" && board[boardWidth-1] === board[(boardWidth-1) + (boardWidth-1)] && board[boardWidth-1] === board[(boardWidth-1) + 2*(boardWidth-1)])){
                return true;
        }
        return false;
    }

    const initBoard = ()=>{
        for (let i = 0; i < boardSize; i++){
            board[i] = "";
        }
        emptyFields = boardSize;
    }

    const decrementEmptyFields = ()=>{
        emptyFields--;
    }

    return {
        getBoard,
        setBoard,
        render,
        checkForGameOver,
        initBoard,
        decrementEmptyFields
    }
})();

const gameController = (function(){

    let currentPlayer;
    let finishedGame;

    const startGame = (player1, player2, board)=>{
        currentPlayer = 0;
        finishedGame = false;
        const fields = Array.from(document.querySelectorAll(".field"));
        const players = [player1, player2];
        board.initBoard();
        board.render();

        fields.forEach((field, index)=>{
            field.addEventListener("click", ()=>markField(field, board, players[currentPlayer], index));
        });
    }

    const markField = (field, board, player, index) =>{
        if (board.getBoard()[index] === "" && !finishedGame){
            board.setBoard(player.getSymbol(), index);
            board.render();
            board.decrementEmptyFields();
            field.children[0].style.color = player.getColor();
            if(board.checkForGameOver() === "win"){
                displayController.displayGameOver(player);
                finishedGame = true;
                displayController.setup();
            }
            else if (board.checkForGameOver() === "draw"){
                displayController.displayGameOver();
                finishedGame = true;
                displayController.setup();
            }
            currentPlayer++;
            currentPlayer%=2;
        }
    }



    return {
        startGame
    }
})();

const playerFactory = (function(name, color, symbol){
    const getName = ()=>name;
    const getColor = ()=>color;
    const getSymbol = ()=>symbol;

    const setName = (newName)=>name = newName;
    return {
        getName,
        getColor,
        getSymbol,
        setName
    }
});

const displayController = (function(){
    const player1 = playerFactory("Player1", "#F00", "x");
    const player2 = playerFactory("Player2", "#00F", "o");
    const startBtn = document.getElementById("play-btn");
    const playerInput = document.getElementById("player-input");
    console.log(playerInput);

    const setup = ()=> {
        setStartButtonText("Start");
        startBtn.addEventListener("click", ()=>{
            player1.setName(playerInput.children[0].value);
            player2.setName(playerInput.children[1].value);
            setStartButtonText("Restart");
            gameController.startGame(player1, player2, gameBoard);
            clearGameOverAlerts();
        });
    }

    const setStartButtonText=(text)=>{
        startBtn.textContent = text;
    }

    const displayGameOver = (winner = null)=>{
        const alert = document.createElement("div");
        if (!winner){
            alert.className = "alert draw";
            alert.appendChild(document.createTextNode("It's a draw!"))
            
        }
        else {
            alert.className = "alert winner";
            alert.appendChild(document.createTextNode(`${winner.getName()} (${winner.getSymbol()}) won!`));
            alert.style.background = winner.getColor();
        }
        
        document.body.insertBefore(alert, document.getElementById("board"));
        
    }

    const clearGameOverAlerts = ()=>{
        if(document.querySelector(".alert")){
            document.querySelector(".alert").remove();
        }
    }

    return{
        setup,
        displayGameOver
    }


})();


displayController.setup();