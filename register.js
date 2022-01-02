let submit = document.getElementById("submit");
const username = document.getElementById("username");
const password = document.getElementById("password");

submit.onclick = () => {
    fetch("http://localhost:8080/register", {
        method: 'POST',
        body: JSON.stringify({username: username.value, password: password.value})
    })
        .then(res => {
            if(res.status != 200) clean_input();
            return res.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => console.log(err));
}

const clean_input = () => {
    username.value = "";
    password.value = "";
}