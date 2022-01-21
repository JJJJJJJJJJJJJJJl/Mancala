/* const find_game_hash = (games, target_hash) => {
    console.log("games.length: " + games.length);
    for(let i=0; i<games.length; i++){
        console.log("games[i].game: " + games[i].game);
        console.log("target_hash: " + target_hash);
        if(strcmp(games[i].game, target_hash) == 0){
            return i;
        }
    }
    return -1;
}

const strcmp = (s1, s2) => {
    if(s1.length != s2.length){
        return -1;
    }
    for(let i=0; i<s1.length; i++){
        if(s1[i] != s2[i]){
            console.log("s1: " + s1[i] + " | s2: " + s2[i]);
            return -1;
        }
    }
    return 0;
} */

const find_game_player = (games, target_player) => {
    for(let i=0; i<games.length; i++){
        if(games[i].player1 == target_player){
            return i;
        }
    }
    return -1;
}

const remove_game = (games, target_hash) => {
    const game_index = find(games, target_hash);
    if(game != -1){
        return games.splice(game_index, game_index)
    }
    else{
        console.log("game did not exist");
        return undefined;
    }
}

const generate_board = (p1_side, p1_warehouse, p2_side, p2_warehouse, holes) => {
    let board = [];
    for(let i=0, j=holes<<1, k=holes-1; i<holes, j>holes, k>-1; i++, j--, k--){
        board[j] = p1_side[i];
        board[k] = p2_side[i];
    }
    board[holes] = p1_warehouse;
    board[(holes<<1)+1] = p2_warehouse;
    return board;
}

const check_board = (board, p1, p2, holes, switch_turn) => {
    let p1_pieces = 0;
    let p2_pieces = 0;
    for(let i=0, j=holes<<1; i<holes, j>holes; i++, j--){
        p1_pieces += board[j];
        p2_pieces += board[i];
    }
    if(p1_pieces + p2_pieces == 0){
        if(board[holes] > board[(holes<<1)+1]){
            return 1;
        }
        else if(board[holes] < board[(holes<<1)+1]){
            return 2;
        }
        else{
            //draw
            return 3;
        }
    }
    else if(p1_pieces == 0 && switch_turn == 0){
        if(board[holes] > board[(holes<<1)+1] + p2_pieces){
            return 1;
        }
        else if(board[holes] < board[(holes<<1)+1] + p2_pieces){
            return 2;
        }
        else{
            return 3;
        }
    }
    else if(p2_pieces == 0 && switch_turn == 1){
        if(board[holes] + p1_pieces > board[(holes<<1)+1]){
            return 1;
        }
        else if(board[holes] + p1_pieces < board[(holes<<1)+1]){
            return 2;
        }
        else{
            return 3;
        }
    }
    else{
        //game proceeds
        return 0;
    }
}

const process_move = (board, hole_id, hole_value, holes_number) => {
    let switch_player = 1;
    let cur_hole = parseInt(hole_id) == 0 ? holes_number + 1 : parseInt(hole_id) - 1;
    //traversing board *hole_value* times
    for(let i=0; i<hole_value; i++){
        if(cur_hole == holes_number+1){
            i--;
            cur_hole--;
        }
        //right warehouse was reached and its value is incremented by one
        else if(cur_hole == holes_number>>1){
            //player 1 last piece landed on its own warehouse so he keeps playing
            if(i == hole_value-1){
                switch_player = 0;
            }
            const right_warehouse_value = board[holes_number>>1];
            //updating board struct
            board[cur_hole--] = right_warehouse_value + 1;
        }
        //*cur_hole* hole was reached and its value is incremented by one 
        else{
            const value = board[cur_hole];
            //when player 1 last iteration move lands on one of its own side empty hole
            //he then gets that last piece plus the opponent opposite hole pieces on his warehouse (right)
            if(i == hole_value-1 && value == 0 && cur_hole > holes_number>>1){
                    const right_warehouse_value = board[holes_number>>1];
                    const opposite_hole_value = board[holes_number-cur_hole];
                    //updating board struct
                    board[holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                    board[holes_number>>1] = right_warehouse_value + opposite_hole_value + 1;

            }
            //regular move
            else{
                //updating board struct
                board[cur_hole--] = value + 1;
            }
        }

        //initial hole value is decremented by one each iteration
        //a move might iterate more than the *hole_value* (when it skips the opponent warehouse)
        //also if a move iteration goes through the clicked hole the value isnt decreased (only increased) {if i get confused coming back to this later, visualizing this case helps a lot}
        if(board[hole_id] > 0 && cur_hole+1 !== hole_id){
            board[hole_id]--;
        }
        //cur_hole reached -1 value that means left warehouse
        if(cur_hole == -1){
            cur_hole = holes_number + 1;
        }
    }
    if(switch_player == 1) return 1;
    else return 0;
}

module.exports = {
    find_game_player,
    remove_game,
    check_board,
    process_move,
    generate_board,
}