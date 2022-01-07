let current_game;
const player = logged_username;
let opp;

const create_sse = (game_hash) => {
    current_game = new EventSource("/" + game_hash);
    current_game.addEventListener('open', () => {
        fetch_opp_username();
    })
    current_game.addEventListener('message', (data) => {
        const player_holes = data.sides.player.holes;
        const player_warehouse_value = data.sides.player.warehouse;
        const opp_holes = data.sides.opp.holes;
        const opp_warehouse_value = data.sides.opp.warehouse;
        update_board(player_holes, player_warehouse_value, opp_holes, opp_warehouse_value);
    });
}

const fetch_opp_username = () => {
  fetch("http://localhost:8080/opp", {
    method: 'GET',
    body: JSON.stringify({user: player})
})
    .then(res => {
        return res.json();
    })
    .then(data => {
        opp = data.opp;
    })
    .catch(err => {
        console.log(err)
    });
}