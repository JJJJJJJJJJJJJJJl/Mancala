const ogstatus = document.getElementById("online_game_status");
let logged_username;
let logged_password;

const join_game = (grp, user, pw, hn, hv) => {
    fetch(server + "join", {
        method: 'POST',
        body: JSON.stringify({group: grp, nick: user, password: pw, size: hn>>1, initial: hv})
    })
        .then(res => {
            if(res.status == 401){
                return {error: "invalid authentication data"};
            }
            else{
                return res.json();
            }
        })
        .then(data => {
            if(data.error != undefined){
                join_error(data.error);
            }
            else{
                create_sse(data["game"]);
                waiting();
                leave_option();
                game.start_game();
                add_click_holes();
            }
        })
        .catch(err => {
            console.log(err);
        });
}