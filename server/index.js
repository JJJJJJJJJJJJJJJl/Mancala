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
        console.log("get");
        let game_index;
        let sanned_url;
        sanned_url = req.url.substring(1, req.url.length);
        game_index = manager.find_game_hash(active_games, sanned_url);
        console.log("game_index: " + game_index);
        if(game_index != -1){
            if(active_games[game_index].h == 0){
                res.writeHead(200, {
                    'Content-Type' : 'text/event-stream',
                    'Cache-Control' : 'no-cache',
                    'Connection' : 'keep-alive',
                    "Access-Control-Allow-Origin": "*"
                });
            }
            const p1 = active_games[game_index].player1;
            const p2 = active_games[game_index].player2;
                res.write("id: " + Date.now() + `\ndata: ${JSON.stringify(
                    {sides: {
                        [p1]: {
                            warehouse: active_games[game_index].p1warehouse,
                            holes: active_games[game_index].p1board
                        },
                        [p2]: {
                            warehouse: active_games[game_index].p2warehouse,
                            holes: active_games[game_index].p2board
                        }
                    },
                    turn: [p1]})}` + '\n\n');
        }
        else{
            res.writeHead(200, {
                'Content-Type' : 'text/event-stream',
                'Cache-Control' : 'no-cache',
                'Connection' : 'keep-alive',
                "Access-Control-Allow-Origin": "*"
            });
            res.write("id: " + Date.now() + "\ndata: waiting for game\n\n");
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
            let holes;
            let hole_value;
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                const type = "normal_game_" + data.holes_number + "_" + data.holes_value;
                console.log(type);
                if(type == 'normal_game_10_3'){
                    holes = 5;
                    hole_value = 3;
                    //queue not empty so match player with waiting player
                    if(queue.normal_game_103.length(type) != 0){
                        if(queue.normal_game_103.peek(type) != data.username){
                            const player_ready = queue.normal_game_103.dequeue(type);
                            //send info to waiting player
    
                            //send info to player that just joined
                            let player1_board = [];
                            let player2_board = [];
                            for(let i=0; i<holes; i++){
                                player1_board[i] = hole_value
                                player2_board[i] = hole_value;
                            }
                            active_games.push({game: player_ready.game_hash,
                                    player1: player_ready.username, 
                                    p1board: player1_board,
                                    p1warehouse: 0,
                                    player2: data.username,
                                    p2board: player2_board,
                                    p2warehouse: 0,
                                    h: 0});
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
        else{
            res.writeHead(400);
            res.end('unexistent endpoint :/');
        }
    }
}

const server = http.createServer(requestListener);
server.listen(8080);