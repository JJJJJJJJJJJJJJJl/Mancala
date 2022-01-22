const check_username = (username) => {
    if(username.length < 5){
        console.log("username must be atleaste 5 characters long");
        return 1;
    }
    return 0;
}

const find = (json, target) => {
    const len = Object.getOwnPropertyNames(json.usernames).length;
    for(let i=1; i<=len; i++){
        if(json.usernames[i] == target){
            return i;
        }
    }
    return -1;
}

const auth_user = (json, target_user, target_pw) => {
    const user_id = find(json, target_user);
    if(json.passwords[user_id] == target_pw){
        return user_id;
    }
    return -1;
}

module.exports = {
    check_username,
    find,
    auth_user,
}