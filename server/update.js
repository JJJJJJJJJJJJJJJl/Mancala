const update_players = (responses, gamehash, p1, p2, game, board, switch_turn) => {
    if(board != undefined){
        const size = game.p1board.length;
        //holes
        for(let i=0, j=size<<1, k=size-1; i<size, j>size, k>-1; i++, j--, k--){
            if(game.player1 == p1){
                game.p1board[i] = board[j];
                game.p2board[i] = board[k];
            }
            else{
                game.p2board[i] = board[j];
                game.p1board[i] = board[k];
            }
        }
        console.log("p1board: " + game.p1board);
        console.log("p2board: " + game.p2board);
        //warehouses
        if(game.player1 == p1){
            game.p1warehouse = board[size];
            game.p2warehouse = board[(size<<1)+1];
        }
        else{
            game.p2warehouse = board[size];
            game.p1warehouse = board[(size<<1)+1];
        }
        //player switching
        if(switch_turn == 1){
            if(game.turn == p1){
                game.turn = p2;
            }
            else{
                game.turn = p1;
            }
        }
    }
    if(game.player1 != p1){
        let temp = p1;
        p1 = p2;
        p2 = temp;
    }
    for(let i=0; i<responses[gamehash].length; i++){
        const stream = responses[gamehash][i];
        stream.write("id: " + Date.now() + `\ndata: ${JSON.stringify(
            {board:
                {sides: {
                    [p1]: {
                        store: game.p1warehouse,
                        pits: game.p1board
                    },
                    [p2]: {
                        store: game.p2warehouse,
                        pits: game.p2board
                    }
                },
                turn: game.turn}
        })}` + '\n\n');
    }
}

module.exports = {
    update_players,
}