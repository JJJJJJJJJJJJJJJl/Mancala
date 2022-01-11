const ogstatus = document.getElementById("online_game_status");
let logged_username;
let logged_password;

const join_game = (grp, user, pw, hn, hv) => {
    fetch(second + "join", {
        method: 'POST',
        body: JSON.stringify({group: grp, nick: user, password: pw, size: hn>>1, initial: hv})
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data["game"]);
            create_sse(data["game"]);
            waiting();
        })
        .catch(err => {
            console.log(err);
        });
}

const waiting = () => {
    ogstatus.innerText = "waiting for player..";
}

const start = (opp) => {
    ogstatus.innerHTML = 'playing against <span style="color: rgba(255, 0, 128, 0.69)">' + opp.toUpperCase() + "</span>";
}