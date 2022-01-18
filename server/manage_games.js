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
    console.log("holes: " + holes);
    let board = [];
    for(let i=0; i<holes; i++){
        board[i] = p2_side[i];
    }
    board[holes] = p2_warehouse;
    for(let i=0, j=holes<<1; i<holes, j>holes; i++, j--){
        board[j] = p1_side[i];
    }
    board[(holes<<1)+1] = p1_warehouse;
    return board;
}

module.exports = {
    find_game_player,
    remove_game,
    generate_board,
}