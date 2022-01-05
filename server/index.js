const http = require('http');
const fs = require('fs').promises;
const auth = require('./auth');

let users_file;
let id_file;

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
};

const read_users = (file) => {
    fs.readFile("users.json")
    .then(content => {
        users_file = JSON.parse(content);
    }).catch(err => {
        console.error(err);
        //process.exit(1);
    });
}
read_users();

const read_curid = () => {
    fs.readFile("id.txt")
    .then(content => {
        id_file = parseInt(content.toString());
    }).catch(err => {
        console.error(err);
        //process.exit(1);
    });
}
read_curid();

const find = (json, target) => {
    const len = Object.getOwnPropertyNames(json.usernames).length;
    for(let i=1; i<=len; i++){
        if(json.usernames[i] == target){
            return 777;
        }
    }
    return -1;
}

const requestListener = function (req, res) {
    if(req.url == "/register"){
        if(req.method == 'POST'){
            console.log("POST");
            let data;
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                if(auth.check_username(data.username) == 1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "invalid username"}));
                }
                else if(find(users_file, data.username) != -1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "username already exists"}));
                }
                else{
                    users_file.usernames[id_file + 1] = data.username;
                    users_file.passwords[id_file + 1] = data.password;
                    users_file.wins[id_file + 1] = 0;
                    users_file.games[id_file + 1] = 0;
                    fs.writeFile("id.txt", (id_file + 1).toString());
                    fs.writeFile("users.json", JSON.stringify(users_file));
                    read_users();
                    read_curid();
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({}));
                }
            });
        }
        else{
            console.log("whatever");
            res.writeHead(200);
            res.end('Hello, World!');
        }
    }
}

const server = http.createServer(requestListener);
server.listen(8080);