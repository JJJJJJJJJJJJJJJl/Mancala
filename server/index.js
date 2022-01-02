const http = require('http');
const fs = require('fs').promises;
const auth = require('./auth');

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
};

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
                            console.log(json);
                            json.push(data);
                            fs.writeFile("register.json", JSON.stringify(json))
                            res.end(JSON.stringify({}));
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