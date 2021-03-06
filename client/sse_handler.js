let current_game;

const create_sse = (gh) => {
    game_hash = gh;
    console.log(server + "update?nick=" + logged_username + "&game=" + gh);
    current_game = new EventSource(server + "update?nick=" + logged_username + "&game=" + gh);
    current_game.onopen = () => {
        console.log("game notifier up");
    }
    current_game.onmessage = (e) => {
        let data = JSON.parse(e.data);
        console.log(data);
        parse_game_data(data, current_game);
    }
    current_game.onerror = (e) => {
        console.log("error: " + e);
        current_game.close();
    }
}