const login_container = document.getElementById("login_input");
let login = document.getElementById("login_submit");
const login_username = document.getElementById("login_username");
const login_password = document.getElementById("login_password");

let logged_username;

login.onclick = () => {
    fetch("http://localhost:8080/login", {
        method: 'POST',
        body: JSON.stringify({username: login_username.value, password: login_password.value})
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            //if object empty
            if(Object.getOwnPropertyNames(data).length == 0){
                logged_username = login_username.value;
                login_update("logged in");
                clean_login_input();
                logged_in();
                console.log("success!");
            }
            else{
                console.log("not success :#");
                login_update(data.error);
            }
            console.log(data);
        })
        .catch(err => {
            console.log(err)
        });
}

const logged_in = () => {
    const menu_container = document.getElementById("menu");
    menu_container.removeChild(register_button);
    menu_container.removeChild(login_button);

    const logged = document.createElement("div");
    logged.setAttribute("class", "logged");
    logged.innerText = "logged as " + logged_username;

    menu_container.appendChild(logged);
}

const login_update = (message) => {
    let p = document.getElementById("login_message");
    if(p == undefined){
        p = document.createElement("p");
        p.setAttribute("id", "login_message");
        login_container.appendChild(p);
    }
    p.innerText = message;
}

const clean_login_update_message = () => {
    if(login_container.childElementCount > 5) login_container.removeChild(login_container.lastChild);
}

const clean_login_input = () => {
    login_username.value = "";
    login_password.value = "";
}