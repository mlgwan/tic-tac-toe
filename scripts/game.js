const gameBoard = (function(){
    let board = [];
    const boardElement = Array.from(document.getElementById("board").children);

    const getBoard = ()=> board;

    const setBoard = (value, position) => board[position] = value;

    const render = () =>{
        board.forEach((value, index)=>{
             boardElement[index].children[0].textContent = value;
        })
    }

    return {
        getBoard,
        setBoard,
        render
    }
})();

const gameController = (function(){


    const startGame = (player1, player2, board)=>{
        const fields = Array.from(document.querySelectorAll(".field"));
        const players = [player1, player2];
        let currentPlayer = 0;
        fields.forEach((field, index)=>{
            field.addEventListener("click", ()=>{
                if (board.getBoard()[index] === undefined){
                    board.setBoard(players[currentPlayer].getSymbol(), index);
                    board.render();
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