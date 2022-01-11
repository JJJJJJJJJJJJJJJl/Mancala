const register_container = document.getElementById("register_input");
let submit = document.getElementById("register_submit");
const register_username = document.getElementById("register_username");
const register_password = document.getElementById("register_password");

submit.onclick = () => {
    fetch(second + "register", {
        method: 'POST',
        body: JSON.stringify({nick: register_username.value, password: register_password.value})
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            //if object empty
            if(Object.getOwnPropertyNames(data).length == 0){
                register_update("successfully registered");
                clean_register_input();
                console.log("success!");
            }
            else{
                console.log("not success :#");
                register_update(data.error);
            }
            console.log(data);
        })
        .catch(err => {
            console.log(err)
        });
}

const register_update = (message) => {
    let p = document.getElementById("register_message");
    if(p == undefined){
        p = document.createElement("p");
        p.setAttribute("id", "register_message");
        register_container.appendChild(p);
    }
    p.innerText = message;
}

const clean_register_update_message = () => {
    if(register_container.childElementCount > 5) register_container.removeChild(register_container.lastChild);
}

const clean_register_input = () => {
    register_username.value = "";
    register_password.value = "";
}