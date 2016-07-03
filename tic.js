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
    var gameOver = false;
    /* BOOl
    * true: game in progress
    * false: game not in progress
    */
    var inGame = false;

    //DOM elements
    var playDlg = $("#playDialog");
    var winnerDlg = $("#winnerDialog");
    var Play = $("#opener-btn");
    var cells = $(".cell");

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
    function setupEndWidget(winner) {
        winnerDlg.dialog({
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
                    $(this).dialog("close");
                }
            },
            position: {
              my: "center",
              at: "center"
            }
        });
    }
    // do clean up
    function gameOverHandler(winner) {
        setupEndWidget(Object.keys(mark)[playerTurn]);
        //reset game Variables
        inGame = false;
        GameOver = true;
        mark.player = "";
        mark.AI = "";
        playerTurn = 0;
    }

    function hasWinner(pick) {
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
    }
    //setup the window that asks the user_pick to choose 'X' vs 'O'
    function setupStartWidget() {
        playDlg.dialog({
        autoOpen: false,
        hide: "puff",
        show : "slide",
        height: 200,
        modal: true,
        title: "MAKE YOUR CHOICE!",
        buttons: {
            O: function() {
                  mark.player = "O";
                  mark.AI = "X";
                  inGame = true;
                  AIMove();
                  $(this).dialog("close");
            },
            X: function() {
                  mark.player = "X";
                  mark.AI = "O";
                  inGame = true;
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
            //if(inGame) && playerTurn===1) {
            if(inGame) {
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
