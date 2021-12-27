let submit = document.getElementById("submit");
const username = document.getElementById("username");
const password = document.getElementById("password");

submit.onclick = () => {
    check_username(username.value);
    check_password(password.value);
}

const check_username = (username) => {
    if(username.length < 4 || username.length > 12){
        alert("invalid username: length should be between 4 and 12 characters");
        clean_input();
    }
}

const clean_input = () => {
    username.value = "";
    password.value = "";
}