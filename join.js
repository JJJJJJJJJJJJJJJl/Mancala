const ogstatus = document.getElementById("online_game_status");

const join_game = (grp, user, pw, hn, hv) => {
    fetch("http://localhost:8080/join", {
        method: 'POST',
        body: JSON.stringify({group: grp, username: user, password: pw, holes_number: hn, holes_value: hv})
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            if(data.status == 'waiting'){
                waiting();
                create_sse(data.game);
            }
            else{
                /* REMINDER
                when the second player joins
                which is done here
                demand server sent event
                so the waiting player is aware of second player name */
                start(data.opp);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const waiting = () => {
    ogstatus.innerText = "waiting for player..";
}

const start = (opp) => {
    ogstatus.innerText = "match found! you are now facing " + opp;
}