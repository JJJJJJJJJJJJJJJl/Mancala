let current_game;

const create_sse = (gh) => {
    game_hash = gh;
    console.log(second + "update?nick=" + logged_username + "&game=" + gh);
    current_game = new EventSource(second + "update?nick=" + logged_username + "&game=" + gh);
    current_game.onopen = () => {
        console.log("game notifier up");
    }
    current_game.onmessage = (e) => {
        console.log(e);
        let data = JSON.parse(e.data);
        parse_game_data(data);
    }
    current_game.onerror = (e) => {
        console.log("error: " + e);
    }
}