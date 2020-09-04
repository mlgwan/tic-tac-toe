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


    const startGame = (player1, player2, board)=>{
        const fields = Array.from(document.querySelectorAll(".field"));
        const players = [player1, player2];
        board.initBoard();
        let currentPlayer = 0;
        fields.forEach((field, index)=>{
            field.addEventListener("click", ()=>{
                if (board.getBoard()[index] === ""){
                    board.setBoard(players[currentPlayer].getSymbol(), index);
                    board.render();
                    board.decrementEmptyFields();
                    field.children[0].style.color = players[currentPlayer].getColor();
                    if(board.checkForGameOver() === "win"){
                        alert(players[currentPlayer].getName() +" (" + players[currentPlayer].getSymbol() + ") has won!");
                    }
                    else if (board.checkForGameOver() === "draw"){
                        alert("It's a draw!");
                    }
                    currentPlayer++;
                    currentPlayer%=2;
                }
                

            })
        })
    }



    return {
        startGame
    }
})();

const playerFactory = (function(name, color, symbol){
    const getName = ()=>name;
    const getColor = ()=>color;
    const getSymbol = ()=>symbol;
    return {
        getName,
        getColor,
        getSymbol
    }
});

const player1 = playerFactory("Player1", "#F00", "x");
const player2 = playerFactory("Player2", "#00F", "o");
gameController.startGame(player1, player2, gameBoard);