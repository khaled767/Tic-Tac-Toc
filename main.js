const displayController= (() =>{
    const renderMessage= (message) => {
        document.querySelector("#message").textContent= message
    }
    return {renderMessage};
})();


const gameboard= (() =>{
    let board= Array(9).fill("")

    const render= () =>{
        document.querySelector(".gameboard").innerHTML= board
        .map((square, index) =>`<div class="square" id="square-${index}">${square}</div>`)
        .join("")

        // render the borad => connect the #gameborad with boradHTML
        //document.querySelector(".gameboard").innerHTML= boardHTML

        document.querySelectorAll(".square").forEach(square => {
            square.addEventListener("click", Game.handleClick)
        })
    };
    const getBoard= () => [...board];

    const update= (index, marker) => {
        board[index]= marker;
        render()
    }

    const restart= () => {
        board.fill("");
        render();
    };

    return { getBoard, render, update, restart }
})()


const createPlayer= (name, marker) => ({name, marker})


const Game= (() =>{
    let players=[];
    let gameOver= false;
    let currentPlayerIndex= 0;

    const start = (() =>{
        players= [
        createPlayer(document.querySelector("#player1").value || "Player 1", "X"),
        createPlayer(document.querySelector("#player2").value || "Player 2", "O")
        ]
        currentPlayerIndex= 0
        gameboard.restart()
        gameOver= false;
        displayController.renderMessage("Game Has Started")
    })


    const handleClick= (event) =>{
        if ( gameOver ) return;

        let index= parseInt(event.target.id.split("-")[1])
        if (gameboard.getBoard()[index] !== "") return;

        gameboard.update(index, players[currentPlayerIndex].marker);

        if (checkForWin(gameboard.getBoard(), players[currentPlayerIndex].marker)){
            gameOver= true
            displayController.renderMessage(`${players[currentPlayerIndex].name} win`)
        } else if (checkForTie(gameboard.getBoard())) {
                gameOver = true;
                displayController.renderMessage("It's a tie!");
        } else {
            currentPlayerIndex = 1- currentPlayerIndex
            // currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            displayController.renderMessage(`It's ${players[currentPlayerIndex].name}'s turn`);
        }
    };
    
    return { start, handleClick }
})();


const checkForWin= (board, marker) => {
    const winnigList= [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for (let i = 0; i < winnigList.length ; i++){
        const[a, b, c]= winnigList[i];
        if(board[a] === marker && board[b]=== marker && board[c]=== marker){
            return true
        }
    }
    return false
}


const checkForTie = (board) => board.every(cell => cell !== "");



document.querySelector("#start-button").addEventListener("click", Game.start)
document.querySelector("#restart-button").addEventListener("click", () => {
    gameboard.restart();
    gameOver= false;
    currentPlayerIndex= 0;
    displayController.renderMessage(`Game restarted! it's player 1 turn`)
    Game.start()
})