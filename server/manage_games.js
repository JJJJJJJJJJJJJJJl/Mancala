const find_game_hash = (games, target_hash) => {
    for(let i=0; i<games.length; i++){
        if(games[i].game == target_hash){
            return i;
        }
    }
    return -1;
}

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

module.exports = {
    find_game_hash,
    find_game_player,
    remove_game,
}