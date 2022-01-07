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
            }
            else{
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