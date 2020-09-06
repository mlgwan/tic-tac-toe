

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

        if (!player2.getIsBot()){

            fields.forEach((field, index)=>{
                field.addEventListener("click", ()=>markField(field, board, players[currentPlayer], index));
            });
        }
        else{
            if (player2.getName() === "CPU"){
                fields.forEach((field, index)=>{
                    field.addEventListener("click", ()=>{
                        markField(field, board, players[0], index);
                        markField(field, board, players[1], players[1].randomCpuMove(fields))});
                });
            }
        }

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

const playerFactory = (function(name, color, symbol, isBot){
    const getName = ()=>name;
    const getColor = ()=>color;
    const getSymbol = ()=>symbol;
    const getIsBot = ()=>isBot;

    const setName = (newName)=>name = newName;

    const randomCpuMove = (fields)=>{
        let unoccupiedFields = [];
        for (let i = 0; i < fields.length; i++){
            if (fields[i].children[0].textContent === ""){
                unoccupiedFields.push(i);
            }
        }
        let randomSelection = unoccupiedFields[parseInt(Math.random() * unoccupiedFields.length)];
        return randomSelection;
    }
    return {
        getName,
        getColor,
        getSymbol,
        getIsBot,
        setName,
        randomCpuMove
    }
});

const displayController = (function(){
    
    const startBtn = document.getElementById("play-btn");
    const toggleBtn = document.getElementById("toggle-btn");
    const playerInput = document.getElementById("player-input");
    let currentMode = 0;
    const setup = ()=> {
        setStartButtonText("Start");
        startBtn.addEventListener("click", startGame);
        toggleBtn.addEventListener("click", displayCurrentMode);
    }

    const startGame = ()=>{
        let player1;
        let player2;
        switch (currentMode){
            case 0:
                player1 = playerFactory(`${playerInput.children[0].value}`, "#F00", "x", false);
                player2 = playerFactory(`${playerInput.children[2].value}`, "#00F", "o", false);
                gameController.startGame(player1, player2, gameBoard);
                break;
            case 1:
                player1 = playerFactory(`${playerInput.children[0].value}`, "#F00", "x", false);
                player2 = playerFactory("CPU", "#000", "o", true);
                gameController.startGame(player1, player2, gameBoard);
            default:
                break;
        }
        setStartButtonText("Restart"); 
        clearGameOverAlerts();
    }

    const displayCurrentMode = () =>{
        currentMode++;
        currentMode %= 2;
        switch(currentMode){
            case 0:
                playerInput.children[2].value = "Player2";
                playerInput.children[2].disabled = false;
                break;
            case 1:
                playerInput.children[2].value = "CPU";
                playerInput.children[2].disabled = true;
                break;
            default:
                break;
        }
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