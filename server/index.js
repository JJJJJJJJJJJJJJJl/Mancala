const http = require('http');
const fs = require('fs').promises;
const auth = require('./auth');

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
};

let register_file;
fs.readFile("register.json")
    .then(content => {
        register_file = JSON.parse(content);
    }).catch(err => {
        console.error(err);
        //process.exit(1);
    });

let id_file;
fs.readFile("id.txt")
    .then(content => {
        id_file = parseInt(content.toString());
    }).catch(err => {
        console.error(err);
        //process.exit(1);
    });

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
                else if(find(register_file, data.username) != -1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "username already exists"}));
                }
                else{
                    register_file.usernames[id_file + 1] = data.username;
                    register_file.passwords[id_file + 1] = data.password;
                    fs.writeFile("id.txt", (id_file + 1).toString());
                    fs.writeFile("register.json", JSON.stringify(register_file));
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