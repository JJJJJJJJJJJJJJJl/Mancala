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
        console.log(req.url);
        if(req.url == '/'){
            res.writeHead(200, {"Access-Control-Allow-Origin": "*",
            "Content-Type": "text/html"});
            fs.readFile('../client/index.html')
            .then(content => {
                res.write(content);
                res.end();
            });
        }
        else if(req.url.includes('.css')){
            let file = req.url.substring(1, req.url.length);
            res.writeHead(200, {
            "Content-Type": "text/css"});
            fs.readFile('../client/' + file)
            .then(content => {
                res.write(content);
                res.end();
            })
            .catch(err => console.log(err));
        }
        else if(req.url.includes('.js')){
            let file = req.url.substring(1, req.url.length);
            res.writeHead(200, {
            "Content-Type": "text/javascript"});
            fs.readFile('../client/' + file)
            .then(content => {
                res.write(content);
                res.end();
            })
            .catch(err => console.log(err));
        }
        else if(req.url.includes('update')){
            console.log("nao!");
            let gamehash = req.url.substring(1, req.url.length).split('=')[2];
            res.writeHead(200, {
                'Content-Type' : 'text/event-stream',
                'Cache-Control' : 'no-cache',
                'Connection' : 'keep-alive',
                "Access-Control-Allow-Origin": "*"
            });
            responses[gamehash].push(res);
            if(active_games[gamehash] != undefined){
                update.update_players(
                    responses,
                    gamehash,
                    active_games[gamehash].player1,
                    active_games[gamehash].player2,
                    active_games[gamehash]
                );
            }
        }
    }
    else if(req.method == 'POST'){
        console.log(req.url);
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
                if(auth.check_login(users_file, data.nick, data.password) == -1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: 'invalid user values'}));
                }
                else{
                    const type = "normal_game_" + (data.size<<1) + "_" + data.initial;
                    if(type == 'normal_game_10_3'){
                        holes = 5;
                        hole_value = 3;
                        //queue not empty so match player with waiting player
                        if(queue.normal_game_103.length(type) != 0){
                            if(queue.normal_game_103.peek(type) != data.nick){
                                const player_ready = queue.normal_game_103.dequeue(type);
                                console.log("(" + player_ready.game_hash + ")" + data.nick + " joined to " + player_ready.username + " on: " + type);
        
                                let player1_board = [];
                                let player2_board = [];
                                for(let i=0; i<holes; i++){
                                    player1_board[i] = hole_value
                                    player2_board[i] = hole_value;
                                }
                                active_games[player_ready.game_hash] = {
                                        player1: player_ready.username, 
                                        p1board: player1_board,
                                        p1warehouse: 0,
                                        player2: data.nick,
                                        p2board: player2_board,
                                        p2warehouse: 0,
                                        turn: player_ready.username};
                                res.writeHead(200, headers);
                                res.end(JSON.stringify({game: player_ready.game_hash, status: "matched", opp: player_ready.username}));
                            }
                        }
                        //enqueue player
                        else{
                            //generate game hash
                            let ghash = game_hash.generate_game_hash(data.size, data.initial, Date.now());
                            responses[ghash] = new Array();
                            queue.normal_game_103.enqueue(type, data.nick, ghash);
                            res.writeHead(200, headers);
                            res.end(JSON.stringify({game: ghash, status: "waiting"}));                        
                        }
                    } 
                }
            });
        }
        else if(req.url == '/notify'){
            res.writeHead(200, headers);
            console.log("NOTIFY");
            req.on('data', (chunk) => {
                const notify_data = JSON.parse(chunk);
                const move = notify_data.move;
                const active_game = active_games[notify_data.game];
                let board;
                let pmres;
                if(active_game.player1 == notify_data.nick){
                    board = manager.generate_board(
                        active_game.p1board,
                        active_game.p1warehouse,
                        active_game.p2board,
                        active_game.p2warehouse,
                        active_game.p1board.length);
                        console.log("board: " + board);
                        pmres = manager.process_move(
                            board,
                            (active_game.p1board.length<<1) - move,
                            active_game.p1board[move],
                            active_game.p1board.length<<1);
                        console.log("board: " + board);
                        update.update_players(
                            responses,
                            notify_data.game,
                            active_game.player1,
                            active_game.player2,
                            active_games[notify_data.game],
                            board,
                            pmres);
                }
                else{
                    board = manager.generate_board(
                        active_game.p2board,
                        active_game.p2warehouse,
                        active_game.p1board,
                        active_game.p1warehouse,
                        active_game.p2board.length);
                        console.log("board: " + board);
                        pmres = manager.process_move(
                            board,
                            (active_game.p2board.length<<1) - move,
                            active_game.p2board[move],
                            active_game.p2board.length<<1);
                        console.log("board: " + board);
                        update.update_players(
                            responses,
                            notify_data.game,
                            active_game.player2,
                            active_game.player1,
                            active_games[notify_data.game],
                            board,
                            pmres);
                }
            });
            res.end('nice move');
        }
        else{
            res.writeHead(400);
            res.end('unexistent endpoint :/');
        }
    }
}

const server = http.createServer(requestListener);
server.listen(9026);