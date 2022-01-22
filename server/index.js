/* MODULES */
const http = require('http');
const fs = require('fs').promises;
const auth = require('./auth');
const queue = require('./queue');
const crypto = require('./crypto');
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

const get_user_id = (usernames, target) => {
    const size = Object.keys(usernames).length;
    for(let i=1; i<=size; i++){
        if(usernames[i] == target){
            return i;
        }
    }
    return -1;
}

const update_players_record = (p1, p2,  winner) => {
    let p1_id = get_user_id(users_file.usernames, p1);
    let p2_id = get_user_id(users_file.usernames, p2);

    if(winner == "draw"){
        users_file.games[p1_id] = parseInt(users_file.games[p1_id]) + 1;
        users_file.games[p2_id] = parseInt(users_file.games[p2_id]) + 1;
    }
    else if(winner == p1){
        if(p1_id != -1){
            users_file.games[p1_id] = parseInt(users_file.games[p1_id]) + 1;
            users_file.wins[p1_id] = parseInt(users_file.wins[p1_id]) + 1;
        }
        if(p2_id != -1){
            users_file.games[p2_id] = parseInt(users_file.games[p2_id]) + 1;
        }
    }
    else{
        if(p1_id != -1){
            users_file.games[p1_id] = parseInt(users_file.games[p1_id]) + 1;
        }
        if(p2_id != -1){
            users_file.games[p2_id] = parseInt(users_file.games[p2_id]) + 1;
            users_file.wins[p2_id] = parseInt(users_file.wins[p2_id]) + 1;
        }
    }
    fs.writeFile("users.json", JSON.stringify(users_file));
    read_users();
}

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
        else if(req.url.includes('.png')){
            let file = req.url.substring(1, req.url.length);
            res.writeHead(200, {
            "Content-Type": "image/png"});
            fs.readFile('../client/' + file)
            .then(content => {
                res.end(content);
            })
            .catch(err => console.log(err));
        }
        else if(req.url.includes('update')){
            let gamehash = req.url.substring(1, req.url.length).split('=')[2];
            if(responses[gamehash] != undefined){
                res.writeHead(200, {
                    'Content-Type' : 'text/event-stream',
                    'Cache-Control' : 'no-cache',
                    'Connection' : 'keep-alive',
                    "Access-Control-Allow-Origin": "*"
                });
                responses[gamehash].push(res);
                if(active_games[gamehash] != undefined){
                    update.update_players_game(
                        responses,
                        gamehash,
                        active_games[gamehash].player1,
                        active_games[gamehash].player2,
                        active_games[gamehash]
                    );
                }
            }
        }
    }
    else if(req.method == 'POST'){
        console.log(req.url);
        if(req.url == "/register"){
            read_users();
            read_curid();
            req.on('data', (chunk) => {
                data = JSON.parse(chunk);
                if(auth.check_username(data.nick) == 1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "invalid username"}));
                }
                else if(auth.find(users_file, data.nick) != -1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: "username already exists"}));
                }
                else{
                    users_file.usernames[id_file + 1] = data.nick;
                    const hashed_pw = crypto.hash_pw(data.password);
                    users_file.passwords[id_file + 1] = hashed_pw;
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
                else if(auth.auth_user(users_file, data.username, crypto.hash_pw(data.password)) == -1){
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
                if(auth.auth_user(users_file, data.nick, crypto.hash_pw(data.password)) == -1){
                    res.writeHead(400, headers);
                    res.end(JSON.stringify({error: 'invalid user values'}));
                }
                else{
                    holes = data.size;
                    hole_value = data.initial;
                    let q;
                    if(holes == 5 && hole_value == 3) q = queue.normal_game_103;
                    if(holes == 6 && hole_value == 3) q = queue.normal_game_123;
                    if(holes == 5 && hole_value == 5) q = queue.normal_game_105;
                    if(holes == 6 && hole_value == 5) q = queue.normal_game_125;
                    //queue not empty so match player with waiting player
                    if(q.length() != 0){
                        if(q.peek() != data.nick){
                            const player_ready = q.dequeue();
                            console.log("(" + player_ready.game_hash + ")" + data.nick + " joined to " + player_ready.username + " on: normal_game_103");
    
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
                                    turn: player_ready.username,
                                    game_queue: q};
                            res.writeHead(200, headers);
                            res.end(JSON.stringify({game: player_ready.game_hash, status: "matched", opp: player_ready.username}));
                        }
                        else{
                            res.writeHead(400, headers);
                            res.end(JSON.stringify({error: `maybe <span id="leave_queue" style="color: rgba(255, 0, 128, 0.69)" onclick="leave()">leave</span> queue before requeue`}));
                        }
                    }
                    //enqueue player
                    else{
                        //generate game hash
                        let ghash = crypto.generate_game_hash(data.size, data.initial, data.nick);
                        responses[ghash] = new Array();
                        q.enqueue(data.nick, ghash);
                        res.writeHead(200, headers);
                        res.end(JSON.stringify({game: ghash, status: "waiting"}));                        
                    }
                }
            });
        }
        else if(req.url == '/leave'){
            req.on('data', (chunk) => {
                res.writeHead(200, headers);
                data = JSON.parse(chunk);
                const gh = data.game;
                //leave game
                if(active_games[gh] != undefined){
                    console.log(data.nick + " left " + data.game);

                    const winner = active_games[gh].player1 == data.nick ?
                    active_games[gh].player2 : active_games[gh].player1;

                    update.update_players_end(responses, gh, winner);
                    update_players_record(
                        active_games[gh].player1,
                        active_games[gh].player2,
                        winner
                    );

                    active_games[gh] = undefined;
                }
                //leave queue
                else{
                    queue.leave_queue(data.nick);
                }
                responses[gh] = undefined;
                res.end(JSON.stringify({}));
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
                let check;
                if(active_game.player1 == notify_data.nick){
                    board = manager.generate_board(
                        active_game.p1board,
                        active_game.p1warehouse,
                        active_game.p2board,
                        active_game.p2warehouse,
                        active_game.p1board.length
                    );
                    pmres = manager.process_move(
                        board,
                        (active_game.p1board.length<<1) - move,
                        active_game.p1board[move],
                        active_game.p1board.length<<1
                    );
                    check = manager.check_board(board,
                        active_game.p1board,
                        active_game.p2board,
                        active_game.p1board.length,
                        pmres
                    );
                    if(check == 0){
                        update.update_players_game(
                            responses,
                            notify_data.game,
                            active_game.player1,
                            active_game.player2,
                            active_games[notify_data.game],
                            board,
                            pmres
                        );
                    }
                    else{
                        if(check == 3){
                            update.update_players_end(responses, notify_data.game, "draw");
                            update_players_record(
                                active_games.player1,
                                active_games.player2,
                                "draw"
                            );
                        }
                        else{
                            const winner = check == 1 ? active_game.player1 : active_game.player2;
                            update.update_players_end(responses, notify_data.game, winner);
                            update_players_record(
                                active_games.player1,
                                active_games.player2,
                                winner
                            );
                        }
                        active_games[notify_data.game] = undefined;
                        responses[notify_data.game] = undefined;
                    }
                }
                else{
                    board = manager.generate_board(
                        active_game.p2board,
                        active_game.p2warehouse,
                        active_game.p1board,
                        active_game.p1warehouse,
                        active_game.p2board.length
                    );
                    pmres = manager.process_move(
                        board,
                        (active_game.p2board.length<<1) - move,
                        active_game.p2board[move],
                        active_game.p2board.length<<1
                    );
                    check = manager.check_board(board,
                        active_game.p2board,
                        active_game.p1board,
                        active_game.p2board.length,
                        pmres
                    );
                    if(check == 0){
                        update.update_players_game(
                            responses,
                            notify_data.game,
                            active_game.player2,
                            active_game.player1,
                            active_games[notify_data.game],
                            board,
                            pmres
                        );
                    }
                    else{
                        if(check == 3){
                            update.update_players_end(responses, notify_data.game, "draw");
                            update_players_record(
                                active_games.player1,
                                active_games.player2,
                                "draw"
                            );
                        }
                        else{
                            const winner = check == 1 ? active_game.player2 : active_game.player1;
                            update.update_players_end(responses, notify_data.game, winner);
                            update_players_record(
                                active_games.player1,
                                active_games.player2,
                                winner
                            );
                        }
                        active_games[notify_data.game] = undefined;
                        responses[notify_data.game] = undefined;
                    }
                }
            });
            res.end('nice move');
        }
        else if(req.url == '/ranking'){
            let naked = [];
            const size = Object.keys(users_file.games).length;
            const rev_comp = (j, k) => {
                if(j.victories > k.victories) return -1;
                else if(j.victories < k.victories) return 1;
                else{
                    if(j.games > k.games) return 1;
                    else if(j.games < k.games) return -1;
                    else return 0;
                }
            }
            for(let i=1; i<=size; i++){
                naked.push({
                    nick: users_file.usernames[i],
                    victories: users_file.wins[i],
                    games: users_file.games[i]}
                );
            }
            naked.sort(rev_comp);
            let leaderboard = [];
            for(let i=0; i<10; i++){
                leaderboard.push(naked[i]);
            }
            console.log(leaderboard);
            res.writeHead(200, headers);
            res.end(JSON.stringify({ranking: leaderboard}));
        }
        else{
            res.writeHead(400);
            res.end('unexistent endpoint :/');
        }
    }
}

const server = http.createServer(requestListener);
server.listen(9026);