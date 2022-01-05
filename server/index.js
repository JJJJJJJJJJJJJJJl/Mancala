const http = require('http');
const fs = require('fs').promises;
const auth = require('./auth');

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
};

const find = (json, target) => {
    const len = Object.getOwnPropertyNames(json.usernames).length
    console.log("len " + len);
    for(let i=1; i<=len; i++){
        console.log(i + ": " + json.usernames[i]);
        if(json.usernames[i] == target){
            return 69;
        }
    }
    console.log("kek");
    return -1;
}

const requestListener = function (req, res) {
    if(req.url == "/register"){
        if(req.method == 'POST'){
            console.log("POST");
            let data;
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                console.log("data user: " + data.username);
                if(auth.check_username(data.username) == 1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "invalid username"}));
                }
                else{
                    fs.readFile("register.json")
                        .then(content => {
                            res.writeHead(200, headers);
                            let json = JSON.parse(content);
                            if(find(json, data.username) != -1){
                                res.writeHead(400, headers);
                                res.end(JSON.stringify({error: "username already exists"}));
                            }
                            else{
                                fs.readFile("id.txt")
                                    .then(content => {
                                        id_int = parseInt(content.toString()) + 1;
                                        id = id_int.toString();
                                        fs.writeFile("id.txt", id);
                                        console.log("id: " + id);
                                        json.usernames[id] = data.username;
                                        json.passwords[id] = data.password;
                                        console.log(json);
                                        fs.writeFile("register.json", JSON.stringify(json))
                                        res.end(JSON.stringify({}));
                                    }).catch(err => {
                                        console.error(err);
                                        //process.exit(1);
                                    });
                            }
                        }).catch(err => {
                            console.error(err);
                            //process.exit(1);
                        });
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