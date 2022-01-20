const leave = () => {
    fetch(server + "leave", {
        method: 'POST',
        body: JSON.stringify({game: game_hash, nick: logged_username, password: logged_password})
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        if(current_game != undefined){
            current_game.close();
        }
        clean_status();
        game_hash = undefined;
    })
    .catch(err => {
        console.log(err);
    });
}

const leave_option = () => {
    const container = document.getElementById("game_control");

    const leave_button = document.createElement("h3");
    leave_button.setAttribute("id", "leave_button");
    leave_button.innerHTML = "&nbsp;LEAVE &#x1F987;";

    leave_button.onclick = () => {
        leave();
        remove_leave_button();
    };
    container.appendChild(leave_button);
}

const remove_leave_button = () => {
    const leave_butt = document.getElementById("leave_button");
    if(leave_butt != undefined){
        leave_butt.parentNode.removeChild(leave_butt);
    }
}