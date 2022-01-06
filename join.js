const join_game = (grp, user, pw, hn, hv) => {
    fetch("http://localhost:8080/join", {
        method: 'POST',
        body: JSON.stringify({group: grp, username: user, password: pw, holes_number: hn, holes_value: hv})
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            
        })
        .catch(err => {
            console.log(err)
        });
}