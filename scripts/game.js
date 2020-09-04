const gameBoard = (function(){
    let board = ["x","o","x","o","x","o","x","o","o"];
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


    return {

    }
})();

const playerFactory = (function(name){


    return {

    }
})();