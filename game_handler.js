let game_hash;
let opp;

const parse_game_data = (data) => {
    if(data.winner != undefined){
        console.log("winner: " + data.winner)
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
        console.log("BOARD UPDATED!");
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