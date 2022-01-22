let game_hash;
let opp;

const parse_game_data = (data, current_game) => {
    if(data.winner != undefined){
        show_game_result(data)
        clean_board_option();
        game_hash = undefined;
        remove_leave_button();
    }
    else{
        const pmove = data.board["turn"];
        game.player_move = pmove;
        set_playing();
        if(opp == undefined){
            get_opp(data.board.sides);
        }

        if(game.player2 == -1){
            game.player2 = opp;
            start(game.player2);
        }
        update_board(data.board.sides[logged_username].pits,
                    data.board.sides[logged_username].store,
                    data.board.sides[opp].pits,
                    data.board.sides[opp].store);
        lock_holes();
    }
}
 
const get_opp = (data) => {
    let players = Object.keys(data).sort();
    if(players[0] == logged_username){
        opp = players[1];
    }
    else{
        opp = players[0];
    }
}

const show_game_result = (data) => {
    if(data.winner == null){
        ogstatus.innerText = "Draw"
    }
    else{
        if(data.winner == opp){
            ogstatus.innerText = data.winner + " won! just go next man";
        }
        else{
            ogstatus.innerText = "Congratz you won!"
        }
    }
    document.getElementById("playing").innerText = "";
}

const clean_status = () => {
    ogstatus.innerText = "";
}

const waiting = () => {
    ogstatus.innerText = "waiting for player..";
}

const start = (opp) => {
    ogstatus.innerHTML = 'Your opponent is <span style="color: rgba(255, 0, 128, 0.69)">' + opp.toUpperCase() + "</span>";
}

const join_error = (msg) => {
    ogstatus.innerHTML = msg;
}

const clean_board_option = () => {
    const container = document.getElementById("game_setters");

    const clean_board = document.createElement("h3");
    clean_board.setAttribute("id", "clean_board");
    clean_board.innerHTML = "&#x1F987; CLEAN BOARD &#x1F987;";

    clean_board.onclick = () => {
        clean_div(document.getElementById("game_container"));
        container.removeChild(container.lastChild);
    };

    container.appendChild(clean_board);
}