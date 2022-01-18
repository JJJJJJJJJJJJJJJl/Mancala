/* MODULES */
const http = require('http');
const fs = require('fs').promises;
const auth = require('./auth');
const queue = require('./queue');
const game_hash = require('./crypto');
const manager = require('./manage_games');
const update = require('./update');

/* SERVER STATE */
let data;

let users_file;
let id_file;

let active_games = [];
let responses = [];

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
};


/* FILE MANAGE */
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

/* SERVER LOGIC */
const requestListener = function (req, res) {
    if(req.method == 'GET'){
        console.log("get");
        let gamehash = req.url.substring(1, req.url.length).split('=')[2];
        if(active_games[gamehash] != undefined){
            console.log("res: " + res);
            if(active_games[gamehash].h == 0){
                res.writeHead(200, {
                    'Content-Type' : 'text/event-stream',
                    'Cache-Control' : 'no-cache',
                    'Connection' : 'keep-alive',
                    "Access-Control-Allow-Origin": "*"
                });
            }
            const p1 = active_games[gamehash].player1;
            const p2 = active_games[gamehash].player2;
            responses[gamehash].push(res);
            update.update_players(responses, gamehash, p1, p2, active_games);
        }
        else{
            res.writeHead(200, {
                'Content-Type' : 'text/event-stream',
                'Cache-Control' : 'no-cache',
                'Connection' : 'keep-alive',
                "Access-Control-Allow-Origin": "*"
            });
            responses[gamehash].push(res);
        }
    }
    else if(req.method == 'POST'){
        console.log("url: " + req.url);
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
            let holes;
            let hole_value;
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                const type = "normal_game_" + (data.size<<1) + "_" + data.initial;
                console.log(type);
                console.log("type: " + type);
                if(type == 'normal_game_10_3'){
                    holes = 5;
                    hole_value = 3;
                    //queue not empty so match player with waiting player
                    if(queue.normal_game_103.length(type) != 0){
                        if(queue.normal_game_103.peek(type) != data.nick){
                            const player_ready = queue.normal_game_103.dequeue(type);
                            //send info to waiting player
    
                            //send info to player that just joined
                            let player1_board = [];
                            let player2_board = [];
                            for(let i=0; i<holes; i++){
                                player1_board[i] = hole_value
                                player2_board[i] = hole_value;
                            }
                            console.log("omg: " + player_ready.game_hash);
                            active_games[player_ready.game_hash] = {
                                    player1: player_ready.username, 
                                    p1board: player1_board,
                                    p1warehouse: 0,
                                    player2: data.nick,
                                    p2board: player2_board,
                                    p2warehouse: 0,
                                    h: 0};
                            res.writeHead(200, headers);
                            res.end(JSON.stringify({game: player_ready.game_hash, status: "matched", opp: player_ready.username}));
                        }
                    }
                    //enqueue player
                    else{
                        //generate game hash
                        let ghash = game_hash.generate_game_hash(data.size, data.initial);
                        responses[ghash] = new Array();
                        queue.normal_game_103.enqueue(type, data.nick, ghash);
                        res.writeHead(200, headers);
                        res.end(JSON.stringify({game: ghash, status: "waiting"}));                        
                    }
                } 
            });
        }
        else if(req.url == '/notify'){
            req.on('data', (chunk) => {
                const notify_data = JSON.parse(chunk);
                const move = notify_data.move;
                const active_game = active_games[notify_data.game];
                let board;
                if(active_game.player1 == notify_data.nick){
                    board = manager.generate_board(
                        active_game.p1board,
                        active_game.p1warehouse,
                        active_game.p2board,
                        active_game.p2warehouse,
                        active_game.p1board.length);
                }
                else{
                    board = manager.generate_board(
                        active_game.p2board,
                        active_game.p2warehouse,
                        active_game.p1board,
                        active_game.p1warehouse);
                }
                console.log("board: " + board);
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