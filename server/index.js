const http = require('http');
const fs = require('fs').promises;
const auth = require('./auth');
const queue = require('./queue');
const game_hash = require('./game_hash');
const manager = require('./manage_games');

let data;

let users_file;
let id_file;

let active_games = [];

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


const requestListener = function (req, res) {
    if(req.method == 'GET'){
        const game = manager.find_game_hash(active_games, req.url);
        if(game != -1){
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                
            });
        }
        else{
            res.writeHead(400, headers);
            res.end(JSON.stringify({error: "game does not exist"}));
        }
    }
    else if(req.method == 'POST'){
        if(req.url == "/register"){
            console.log("register");
            read_users();
            read_curid();
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                if(auth.check_username(data.username) == 1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "invalid username"}));
                }
                else if(auth.find(users_file, data.username) != -1){
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
        else if(req.url == "/login"){
            console.log("login");
            read_users();
            read_curid();
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                if(auth.find(users_file, data.username) == -1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "username does not exist"}));
                }
                else if(auth.check_login(users_file, data.username, data.password) == -1){
                    res.writeHead(400, headers); 
                    res.end(JSON.stringify({error: "wrong password"}));
                }
                else{
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({}));
                }
            });
        }
        else if(req.url == '/join'){
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                const type = "normal_game_" + data.holes_number + "_" + data.holes_value;
                console.log(type);
                if(type == 'normal_game_10_3'){
                    //queue not empty so match player with waiting player
                    if(queue.normal_game_103.length(type) != 0){
                        if(queue.normal_game_103.peek(type) != data.username){
                            const player_ready = queue.normal_game_103.dequeue(type);
                            //send info to waiting player
    
                            //send info to player that just joined

                            active_games.push({game: player_ready.game_hash, player1: player_ready.username, player2: data.username});
                            res.writeHead(200, headers);
                            res.end(JSON.stringify({game: player_ready.game_hash, status: "matched", opp: player_ready.username}));
                        }
                    }
                    //enqueue player
                    else{
                        //generate game hash
                        let ghash = game_hash.generate_game_hash(data.holes_number, data.holes_value, Date.now());
                        console.log("hash: "+ghash);
                        queue.normal_game_103.enqueue(type, data.username, ghash);
                        res.writeHead(200, headers);
                        res.end(JSON.stringify({game: ghash, status: "waiting"}));                        
                    }
                } 
            });
        }
        else if(req.url == '/opp'){
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                const player = data.user;
                const game = manager.find_game_player(active_games, player);
                res.writeHead(200, headers);
                res.end(JSON.stringify({opp: game.player2}));
            });
        }
        else{
            res.writeHead(400);
            res.end('unexistent endpoint :/');
        }
    }
}

const server = http.createServer(requestListener);
server.listen(8080);