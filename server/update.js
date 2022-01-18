const update_players = (responses, gamehash, p1, p2, active_games) => {
    for(let i=0; i<responses[gamehash].length; i++){
        const stream = responses[gamehash][i];
        stream.write("id: " + Date.now() + `\ndata: ${JSON.stringify(
            {board:
                {sides: {
                    [p1]: {
                        store: active_games[gamehash].p1warehouse,
                        pits: active_games[gamehash].p1board
                    },
                    [p2]: {
                        store: active_games[gamehash].p2warehouse,
                        pits: active_games[gamehash].p2board
                    }
                },
                turn: [p1]}
        })}` + '\n\n');
    }
}

module.exports = {
    update_players,
}