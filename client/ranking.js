const ranking = () => {
    fetch(server + "ranking", {
        method: 'POST',
        body: JSON.stringify({})
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        display_ranking(data.ranking);
    })
    .catch(err => {
        console.log(err);
    });
}

const display_ranking = (array) => {
    const container = document.getElementById("ranking_table");

    const nicks = document.createElement("div");
    nicks.setAttribute("id", "ranking_nicks");
    const nicks_p = document.createElement("p");
    nicks_p.setAttribute("id", "nicks_p");
    nicks_p.innerText = "Nicks";
    nicks.appendChild(nicks_p);

    const wins = document.createElement("div");
    wins.setAttribute("id", "ranking_wins");
    const wins_p = document.createElement("p");
    wins_p.setAttribute("id", "wins_p");
    wins_p.innerText = "Wins";
    wins.appendChild(wins_p);

    const games = document.createElement("div");
    games.setAttribute("id", "ranking_games");
    const games_p = document.createElement("p");
    games_p.setAttribute("id", "games_p");
    games_p.innerText = "Games";
    games.appendChild(games_p);
    
    
    for(let i=0; i<array.length; i++){
        if(array[i] != undefined){
            const player_nick = document.createElement("p");
            player_nick.innerText = array[i].nick;
            nicks.appendChild(player_nick);
            const player_wins = document.createElement("p");
            player_wins.innerText = array[i].victories;
            wins.appendChild(player_wins);
            const player_games = document.createElement("p");
            player_games.innerText = array[i].games;
            games.appendChild(player_games);
        }
    }

    container.appendChild(nicks);
    container.appendChild(wins);
    container.appendChild(games);
}

const clean_ranking = () => {
    clean_div(document.getElementById("ranking_table"));
}