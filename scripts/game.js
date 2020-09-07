

const gameBoard = (function(){
    let board = [];
    const boardSize = 9;
    const boardWidth = Math.sqrt(boardSize);
    let emptyFields;
    const fields = Array.from(document.querySelectorAll(".field"));

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
    const getFields = ()=>{
        return fields;
    }

    const initFields = () =>{
        fields.forEach((field, index) => {
            field.addEventListener("click",()=> gameController.fieldClicked(field, index));
        })
    }

    return {
        getFields,
        initFields,
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
    let cpu;
    let players = [];

    const fieldClicked = (field, index) =>{
        if(cpu){
            markField(field, players[0], index);
            cpuMove();
        }
        else{
            markField(field, players[currentPlayer], index);
        }
    }

    const startGame = (player1, player2)=>{
        currentPlayer = 0;
        finishedGame = false;
        players.push(player1);
        players.push(player2);
        gameBoard.initBoard();
        gameBoard.render();

        if (player2.getIsBot()){
            cpu = player2;
        }

        else {
            cpu = false;
        }
        
    }

    const markField = (field, player, index) =>{
        if (gameBoard.getBoard()[index] === "" && !finishedGame){
            gameBoard.setBoard(player.getSymbol(), index);
            gameBoard.render();
            gameBoard.decrementEmptyFields();
            field.children[0].style.color = player.getColor();
            checkForGameOver(player);
            currentPlayer++;
            currentPlayer%=2;
        }
    }

    const cpuMove = () =>{
        if (!finishedGame){
            let index = cpu.randomCpuMove(gameBoard.getFields());
            let field = gameBoard.getFields()[index];
            gameBoard.setBoard(cpu.getSymbol(), index);
            gameBoard.render();
            gameBoard.decrementEmptyFields();
            field.children[0].style.color = cpu.getColor();
            checkForGameOver(cpu);
            currentPlayer++;
            currentPlayer%=2;
        }
        
    }

    const checkForGameOver = (player) => {
        if (!finishedGame)
        {
            if(gameBoard.checkForGameOver() === "win"){
            displayController.displayGameOver(player);
            finishedGame = true;
            displayController.setup();
            }
            else if (gameBoard.checkForGameOver() === "draw"){
                displayController.displayGameOver();
                finishedGame = true;
                displayController.setup();
            }
        }
        
    }

    return {
        startGame,
        fieldClicked
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
        console.log("hi");
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
        console.log(currentMode);
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

gameBoard.initFields();

displayController.setup();