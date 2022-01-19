const notify = (hole) => {
    fetch(server + "notify", {
        method: 'POST',
        body: JSON.stringify({nick: logged_username, password: logged_password, game: game_hash, move: hole})
    })
    .then(() => {
        console.log("move on hole " + hole);
    })
    .catch(err => {
        console.log(err);
    });
}