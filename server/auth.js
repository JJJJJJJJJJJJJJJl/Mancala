const check_username = (username) => {
    if(username.length < 5){
        console.log("username must be atleaste 5 characters long");
        return 1;
    }
    return 0;
}

module.exports = {
    check_username,
}