const notify = (hole) => {
    fetch(second + "notify", {
        method: 'POST',
        body: JSON.stringify({nick: logged_username, password: logged_password, game: game_hash, move: hole})
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    });
}