$(document).ready(function() {
    /*
     * user_pick choice of X or O
     */
    var mark = {"AI":"", "Player":"" };

    /*
     * 0: AI
     * 1: player
     */
    var playerTurn = 0;
    var move_counter = 0;

    /* BOOl
    * true: game in progress
    * false: game not in progress
    */
    var inGame = false;
    var gameOver = false;
    //DOM elements
    var playDlg = $("#playDialog");
    var winnerDlg = $("#winnerDialog");
    var Play = $("#opener-btn");
    var cells = $(".cell");
    var player = document.getElementById("player");
    var player_score = document.getElementById("player_score");
    var AI = document.getElementById("AI");
    var AI_score = document.getElementById("AI_score");
    var tie_score = document.getElementById("tie_score");

    //AI random number generator params
    var max = 9;
    var min = 0;

    /*
     * toggles player
     */
    function endTurn() {
        if(inGame == false)
            return;
        playerTurn = 1 - playerTurn;
        if(playerTurn === 0)
            AIMove();
    }

    /*computer makes a move*/
    function AIMove() {
        if(inGame == false)
            return;
        var move_finished = false;
        while(!move_finished) {
            var cellID = Math.floor(Math.random() * (max - min)) + min;
            var cell = cells[cellID];
            if(cell.textContent === "") {
                cell.textContent = mark.AI;
                move_finished = true;
            }
        }
        hasWinner(mark.AI);
        endTurn();
    }

    /*display winner and get ready for next game*/
    function setupEndWidget(winner) {
        winnerDlg.dialog({
            dialogClass: "no-close",
            autoOpen: true,
            hide: "puff",
            show: "slide",
            height: 200,
            modal: true,
            title: "Winner is "+ winner,
            buttons: {
                Ok: function() {
                    //clear the cells
                    for(var i in cells) {
                        cells[i].textContent = "";
                    }
                    player.innerText = "Player";
                    AI.innerText = "AI";
                    //reset game Variables
                    mark.player = "";
                    mark.AI = "";
                    inGame = false;
                    playerTurn = 0;
                    move_counter = 0;
                    $(this).dialog("close");
                }
            },
            position: {
              my: "center",
              at: "center"
            }
        });
    }

    // do clean up for next game
    function gameOverHandler(winner) {
        var scoreTemp;

        gameOver = true;

        //if there is a winner
        if(winner != "no one") {
            //player won!
            if(playerTurn == 1) {
                scoreTemp = player_score.innerText;
                player_score.innerText = eval(scoreTemp+"+1");
            }
            //AI won!
            else {
                scoreTemp = AI_score.innerText;
                AI_score.innerText = eval(scoreTemp+"+1");
            }
            setupEndWidget(Object.keys(mark)[playerTurn]);
        }
        //tie! 
        else {
            setupEndWidget("no one");
            scoreTemp = tie_score.innerText;
            tie_score.innerText = eval(scoreTemp + "+1");
        }
    }

    /*check if we have a winner*/
    function hasWinner(pick) {
        move_counter++;
        //check if there is a winner
        if( (cells[0].textContent=== pick && cells[1].textContent === pick && cells[2].textContent === pick) ||
            (cells[0].textContent === pick && cells[3].textContent === pick && cells[6].textContent === pick) ||
            (cells[0].textContent === pick && cells[4].textContent === pick && cells[8].textContent === pick) ||
            (cells[3].textContent === pick && cells[4].textContent === pick && cells[5].textContent === pick) ||
            (cells[6].textContent === pick && cells[7].textContent === pick && cells[8].textContent === pick) ||
            (cells[2].textContent === pick && cells[5].textContent === pick && cells[8].textContent === pick) ||
            (cells[1].textContent === pick && cells[4].textContent === pick && cells[7].textContent === pick) ||
            (cells[2].textContent === pick && cells[4].textContent === pick && cells[6].textContent === pick)) {
                gameOverHandler(pick);
        }
        //tie!
        else if(move_counter==9){
            gameOverHandler("no one");  
        }
    }

    //setup the window that asks the user_pick to choose 'X' vs 'O'
    function setupStartWidget() {
        console.log("114")
        playDlg.dialog({
        autoOpen: false,
        hide: "puff",
        show : "fold",
        height: 200,
        modal: true,
        title: "MAKE YOUR CHOICE!",
         buttons: {
            O: function() {
                  mark.player = "O";
                  mark.AI = "X";
                  player.innerText += "(O)";
                  AI.innerText += "(X)";
                  inGame = true;
                  gameOver = false;
                  move_counter = 0;
                  AIMove();
                  $(this).dialog("close");
            },
            X: function() {
                  mark.player = "X";
                  mark.AI = "O";
                  player.innerText += "(X)";
                  AI.innerText += "(O)";
                  inGame = true;
                  gameOver = false;
                  move_counter = 0;
                  AIMove();
                  $(this).dialog("close");
            }
        },
        position: {
          my: "center",
          at: "center"
        }
        });
    }
    function addEventHandlers() {
        //show window when user_pick presses on 'PLAY' button
        Play.click(function() {
          if(!inGame) {
              playDlg.dialog("open");
          }
        });

        /*when user_pick makes a move*/
        cells.click(function() {
            if(inGame && playerTurn===1 && gameOver==false) {
                if(this.textContent === "") {
                    //make move and end turn
                    this.textContent = mark.player;
                    hasWinner(mark.player);
                    endTurn();
                }
            }
        });
    }
    /*Function calls*/
    setupStartWidget();
    addEventHandlers();
});
