//best leaf node found
let best;
//next ai move
let ai_hole;

//game object
let game;

class Game{
    constructor(board, player1, player2, holes_number, holes_value, game_mode, game_on) {
      this.board = board;
      this.player1 = player1;
      this.player2 = player2;
      this.holes_number = holes_number;
      this.holes_value = holes_value;
      this.player_move = -1;
      this.mode = game_mode;
      this.on = game_on;
    }

    start_game(){
        load_board();
    }
}

const get_player1 = () => {
    if(logged_username != ""){
        return logged_username;
    }
    else{
        return "guest";
    }
}

const get_player2 = () => {
    if(game.mode == "ai") return 420;
    else if(game.mode == "jjjjjj_ai") return "JJJJJJ AI";
    else if(game.mode == "irl")  return 2;
    return -1;
}

const get_holes_number = () => {
    return parseInt(document.getElementById("holes_number").value);
}

const get_holes_value = () => {
    return parseInt(document.getElementById("holes_value").value);
}

const get_initial_player = () => {
    const rand = Math.round(Math.random()) + 1;
    if(rand == 1){
        return game.player1;
    }
    else{
        return game.player2;
    }
}

const get_game_mode = () => {
    return document.getElementById("game_mode").value;
}

const add_click_holes = () => {
    if(game.mode == 'irl'){
        for(let i=0; i<=game.holes_number; i++){
            if(i != game.holes_number>>1) document.getElementById(i).onclick = () => {
                turn(i);
            };
        }
    }
    else if(game.mode == 'ai' || game.mode == 'jjjjjj_ai' || game.mode == 'online'){
        for(let i=(game.holes_number>>1)+1; i<=game.holes_number; i++){
            document.getElementById(i).onclick = () => {
                turn(i);
            };
        }
    }
}

const init_game = async () => {
    game = new Game([], get_player1(), -1, get_holes_number(), get_holes_value(), get_game_mode(), 0);
    if(game.mode == 'irl' || game.mode == 'ai' || game.mode == 'jjjjjj_ai'){
        game.player2 = get_player2();
        game.player_move = get_initial_player();
        game.on = 1;
        game.start_game();
        add_click_holes();
    }
    else if(game.mode == 'online'){
        if(logged_username == "" || logged_password == ""){
            document.getElementById("playing").innerText = "to play online you must insert both nickname and password";
            return;
        }
        join_game(777, logged_username, logged_password, game.holes_number, game.holes_value);
    }
    if(game.player_move == game.player2 && (game.mode == "ai" || game.mode == 'jjjjjj_ai')) turn();
}

const clean_div = (container) => {
    while(container.hasChildNodes()){
        container.removeChild(container.firstChild);
    }
}


//loads board
const load_board = () => {
    if(game.mode != 'online') document.getElementById("online_game_status").innerText = "";

    //div containing every board element
    const game_container = document.getElementById("game_container");

    //cleaning up board container div
    clean_div(game_container);

    //div represeting the left side warehouse
    const left_warehouse = document.createElement("div");
    const left_warehouse_value = document.createElement("p");
    left_warehouse_value.setAttribute("id", "left_warehouse_value");
    const left_warehouse_pieces_area = document.createElement("div");
    left_warehouse_pieces_area.setAttribute("id", "left_warehouse_pieces_area");
    left_warehouse_pieces_area.setAttribute("class", "pieces");
    left_warehouse.appendChild(left_warehouse_value);
    left_warehouse.appendChild(left_warehouse_pieces_area);
    left_warehouse.setAttribute("id", "left_warehouse");
    left_warehouse.setAttribute("class", "warehouse");
    game.board[game.holes_number+1] = 0;
    left_warehouse_value.innerText = game.board[game.holes_number+1];
    
    //div containing the holes
    const holes = document.createElement("div");
    holes.setAttribute("id", "holes");

    //divs represeting each either up or down hole
    const up_holes = document.createElement("div");
    up_holes.setAttribute("id", "up_holes");
    const down_holes = document.createElement("div");
    down_holes.setAttribute("id", "down_holes");
    
    //div representing the right side warehouse
    const right_warehouse = document.createElement("div");
    const right_warehouse_value = document.createElement("p");
    right_warehouse_value.setAttribute("id", "right_warehouse_value");
    const right_warehouse_pieces_area = document.createElement("div");
    right_warehouse_pieces_area.setAttribute("id", "right_warehouse_pieces_area");
    right_warehouse_pieces_area.setAttribute("class", "pieces");
    right_warehouse.appendChild(right_warehouse_value);
    right_warehouse.appendChild(right_warehouse_pieces_area);
    right_warehouse.setAttribute("id", "right_warehouse");
    right_warehouse.setAttribute("class", "warehouse");
    game.board[game.holes_number>>1] = 0;
    right_warehouse_value.innerText = game.board[game.holes_number>>1];
    
    //creating each individual hole and assigning them the starting_hole_number value 
    for(let i=0; i<=game.holes_number; i++){
        const new_hole = document.createElement("div");
        const hole_value = document.createElement("p");
        const hole_pieces_area = document.createElement("div");
        
        new_hole.appendChild(hole_value)
        new_hole.appendChild(hole_pieces_area);
        
        //assigning each hole its index
        if(i < game.holes_number>>1){
            new_hole.setAttribute("id", i);
            new_hole.setAttribute("class", "hole up");
            game.board[i] = game.holes_value;
            hole_value.innerText = game.board[i];
            hole_value.setAttribute("id", "hole_value_" + i)
            hole_pieces_area.setAttribute("class", "pieces");
            hole_pieces_area.setAttribute("id", "hole_pieces_"+i);
            up_holes.appendChild(new_hole);
        }
        else if(i > game.holes_number>>1){
            const diff = i - (game.holes_number>>1);
            const index = (game.holes_number+1) - diff;
            new_hole.setAttribute("id", index);
            new_hole.setAttribute("class", "hole down");
            game.board[index] = game.holes_value;
            hole_value.innerText = game.board[index];
            hole_value.setAttribute("id", "hole_value_" + index)
            hole_pieces_area.setAttribute("class", "pieces");
            hole_pieces_area.setAttribute("id", "hole_pieces_"+index);
            down_holes.appendChild(new_hole);
        }
    }
    //wrapping
    holes.appendChild(up_holes);
    holes.appendChild(down_holes);
    game_container.appendChild(left_warehouse);
    game_container.appendChild(holes);
    game_container.appendChild(right_warehouse);
    
    display_pieces();

    //might change this later
    set_playing();

    //locking non starting player side/holes
    lock_holes();
}

const random_interval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const set_piece_size = (piece) => {
    piece.style.height = "2.5vh";
    piece.style.width = "2.5vh";
}

const display_pieces = () => {
    let hole_pieces_area;

    for(let i=0; i<=game.holes_number; i++){
        if(i != game.holes_number>>1){
            for(let j=0; j<game.board[i]; j++){
                hole_pieces_area = document.getElementById("hole_pieces_" + i);
                add_pieces(hole_pieces_area, 1);
            }
        }
    }
}

const clean_board_pieces = () => {
    //cleaning left warehouse
    clean_div(document.getElementById("left_warehouse_pieces_area"));
    //cleaning right warehouse
    clean_div(document.getElementById("right_warehouse_pieces_area"));
    //cleaning holes
    let hole_pieces_area;
    for(let i=0; i<=game.holes_number; i++){
        if(i != game.holes_number>>1){
            hole_pieces_area = document.getElementById("hole_pieces_" + i);
            clean_div(hole_pieces_area);
        }
    }
}

const add_pieces = (pieces_area, pieces_to_add) => {
    let piece;
    for(let i=0; i<pieces_to_add; i++){
        piece = document.createElement("div");
        piece.setAttribute("class", "piece");
        set_piece_size(piece);
        piece.style.left = random_interval(10, pieces_area.offsetWidth-50).toString()+"px";
        piece.style.top = random_interval(10, pieces_area.offsetHeight-50).toString()+"px";
        pieces_area.appendChild(piece);
    }
}

const remove_pieces = (pieces_area, pieces_to_remove) => {
    for(let i=0; i<pieces_to_remove; i++){
        pieces_area.removeChild(pieces_area.lastElementChild);
    }
}

const get_next_ai_move = () => {
    let save_player_move = game.player_move;
    let ai_move_hole = calculate_ai_move(7);
    game.player_move = save_player_move;
    set_playing();
    console.log("nextAIMove: "+ai_move_hole);
    on_hole_click(game.board, ai_move_hole);
}

const lock_holes = () => {
    let hole; 

    //unlocking player 1 holes/locking player 2 holes
    if(game.player_move == game.player1){
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            hole = document.getElementById(i);

            //only make it clickable if value isnt 0
            if(parseInt(hole.innerText) !== 0){
                hole.style.pointerEvents = 'auto';
            }
            else{
                hole.style.pointerEvents = 'none';
            }
        }
        for(let i=0; i<game.holes_number>>1; i++){
            hole = document.getElementById(i);
            hole.style.pointerEvents = 'none';
        }
    }
    //unlocking player 2 holes/locking player 1 holes
    else{
        for(let i=0; i<game.holes_number>>1; i++){
            hole = document.getElementById(i);

            //only make it clickable if value isnt 0
            if(parseInt(hole.innerText) !== 0){
                hole.style.pointerEvents = 'auto';
            }
            else{
                hole.style.pointerEvents = 'none';
            }
        }
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            hole = document.getElementById(i);
            hole.style.pointerEvents = 'none';
        }
    }
}

const calculate_ai_move = (depth) => {
    best = -999999;
    let move;
    if(game.mode == 'ai'){
        move = ai(game.board.slice(), 2, depth, -1);
        return move.hole;
    }
    else if(game.mode == 'jjjjjj_ai'){
        jjjjj_ai(game.board.slice(), 2, depth, -1);
        return ai_hole;
    }
}

//this version which is the minimax in its truest form
const ai = (board, entity, depth, initial_hole) => {
    let board_state_saved = board.slice();
    let node_value = board[game.holes_number+1] - board[game.holes_number>>1];
    if(depth == 0 ||
        check_board(board.slice(), 420) == 0 ||
        check_board(board.slice(), 420) == 1 ||
        check_board(board.slice(), 420) == 2)
    {
        let leaf = {value: node_value, hole: 0};
        return leaf;
    }
    else if(entity == 2){
        let alpha = {value: -9999, hole: -1};
        for(let i=0; i<game.holes_number>>1; i++){
            if(board[i] != 0){
                alpha.hole = i;
                game.player_move = entity;
                on_hole_click(board, i, 420);
                alpha.value = Math.max(alpha.value, ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole).value);
                board = board_state_saved.slice();
            }
        }
        return alpha;
    }
    else{
        let alpha = {value: 9999, hole: -1};
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            if(board[i] != 0){
                alpha.hole = i;
                game.player_move = entity;
                on_hole_click(board, i, 420);
                alpha.value = Math.min(alpha.value, ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole).value);
                board = board_state_saved.slice();
            }
        }
        return alpha;
    }
}

//minimax a lil modified lol
//for some reason (that i dont understand) depth 7 plays better than depth 10...
const jjjjj_ai = (board, entity, depth, initial_hole) => {
    let board_state_saved = board.slice();
    let node_value = board[game.holes_number+1] - board[game.holes_number>>1];
    if(depth == 0 ||
        check_board(board.slice(), 420) == 0 ||
        check_board(board.slice(), 420) == 1 ||
        check_board(board.slice(), 420) == 2)
    {
        if(node_value > best){
            best = node_value;
            ai_hole = initial_hole;
        }
    }
    else if(entity == 2){
        for(let i=0; i<game.holes_number>>1; i++){
            if(board[i] != 0){
                game.player_move = entity;
                on_hole_click(board, i, 420);
                jjjjj_ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole);
                board = board_state_saved.slice();
            }
        }
    }
    else{
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            if(board[i] != 0){
                game.player_move = entity;
                on_hole_click(board, i, 420);
                jjjjj_ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole);
                board = board_state_saved.slice();
            }
        }
    }
}

const turn = async (id) => {
    if(game.mode == 'irl'){
        game.player_move == game.player1 ? on_hole_click(game.board, id, game.player1) : on_hole_click(game.board, id, game.player2);
    }
    else if(game.mode == 'ai' || game.mode == 'jjjjjj_ai'){
        game.player_move == game.player1 ? on_hole_click(game.board, id, game.player1) : null;
        while(game.player_move == game.player2 && game.on == 1){
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(get_next_ai_move());
                }, 2000);
            });
        }
    }
    else if(game.mode == 'online'){
        notify(game.holes_number - id);
    }
    else{
        console.log("error: game.mode '" + mode + "' invalid");
        exit(1);
    }
}

//handles each game move
const on_hole_click = (board, hole_id, entity) => {
    //is game still on
    if(game.on == 0) return;
    //is it a valid move
    if((game.player_move == game.player1 && hole_id < game.holes_number>>1) || (game.player_move == game.player2 && hole_id > game.holes_number>>1)) return;
    //clicked hole p element that contains the current value
    const clicked_hole_p_value = document.getElementById("hole_value_"+hole_id);
    //clean clicked hole pieces
    if(entity != 420) clean_div(document.getElementById("hole_pieces_"+hole_id));
    //get hole current value
    const hole_value = entity == 420 ? board[parseInt(hole_id)] : parseInt(clicked_hole_p_value.innerText);
    //get next hole index
    let cur_hole = parseInt(hole_id) == 0 ? game.holes_number + 1 : parseInt(hole_id) - 1;
    //does it switch player after the move
    let switch_player_bool = 1;
    //traversing board *hole_value* times
    for(let i=0; i<hole_value; i++){
        //left warehouse was reached and its value is incremented by one
        if(cur_hole == game.holes_number+1){
            //player 1 move so opponent warehouse (left one) skipped
            if(game.player_move == game.player1){
                i--;
                cur_hole--;
            }
            //regular move
            else{
                //player 2 last piece landed on its own warehouse so he keeps playing
                if(i === hole_value-1){
                    switch_player_bool = 0;
                }
                //ai search space processing related
                if(entity == 420){
                    board[cur_hole--]++;
                }
                else{
                    const left_warehouse_value = board[game.holes_number+1];
                    const left_warehouse_p_value = document.getElementById("left_warehouse_value");
                    const left_warehouse_pieces_area = document.getElementById("left_warehouse_pieces_area");

                    //updating ui
                    left_warehouse_p_value.innerText = left_warehouse_value + 1;
                    //updating board struct
                    board[cur_hole--] = left_warehouse_value + 1;
                    //adding piece to warehouse
                    add_pieces(left_warehouse_pieces_area, 1);
                }
            }
        }
        //right warehouse was reached and its value is incremented by one
        else if(cur_hole == game.holes_number>>1){
            //player 2 move so opponent warehouse (right one) skipped
            if(game.player_move == game.player2){
                i--;
                cur_hole--;
            }
            //regular move
            else{
                //player 1 last piece landed on its own warehouse so he keeps playing
                if(i == hole_value-1){
                    switch_player_bool = 0;
                }
                //ai search space processing related
                if(entity == 420){
                    board[cur_hole--]++;
                }
                else{
                    const right_warehouse_value = board[game.holes_number>>1];
                    const right_warehouse_p_value = document.getElementById("right_warehouse_value");
                    const right_warehouse_pieces_area = document.getElementById("right_warehouse_pieces_area");

                    //updating ui
                    right_warehouse_p_value.innerText = right_warehouse_value + 1;
                    //updating board struct
                    board[cur_hole--] = right_warehouse_value + 1;
                    //adding piece to warehouse
                    add_pieces(right_warehouse_pieces_area, 1);
                }
            }
        }
        //*cur_hole* hole was reached and its value is incremented by one 
        else{
            const value = board[cur_hole];

            //when player 2 last iteration move lands on one of its own side empty hole
            //he then gets that last piece plus the opponent opposite hole pieces on his warehouse (left)
            if(i == hole_value-1 && value == 0 && cur_hole < game.holes_number>>1 && game.player_move == game.player2){
                
                //ai search space processing related
                if(entity == 420){
                    board[game.holes_number+1] += board[game.holes_number-cur_hole] + 1;
                    board[game.holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                }

                else{
                    const left_warehouse_value = board[game.holes_number+1];
                    const left_warehouse_p_value = document.getElementById("left_warehouse_value");
                    const left_warehouse_pieces_area = document.getElementById("left_warehouse_pieces_area");
                    const opposite_hole_value = board[game.holes_number-cur_hole];
                    const opposite_hole_p_value = document.getElementById("hole_value_" + (game.holes_number-cur_hole));
                    const opposite_hole_pieces_area = document.getElementById("hole_pieces_" + (game.holes_number-cur_hole));
                    const hole_p_value = document.getElementById("hole_value_" + cur_hole);

                    //updating ui
                    opposite_hole_p_value.innerText = 0;
                    hole_p_value.innerText = 0;
                    left_warehouse_p_value.innerText = left_warehouse_value + opposite_hole_value + 1;
                    //updating board struct
                    board[game.holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;                
                    board[game.holes_number+1] = left_warehouse_value + opposite_hole_value + 1;

                    //adding pieces to warehouse§
                    add_pieces(left_warehouse_pieces_area, opposite_hole_value + 1);

                    //cleaning pieces of opposite hole
                    clean_div(opposite_hole_pieces_area);
                }
            }
            //when player 1 last iteration move lands on one of its own side empty hole
            //he then gets that last piece plus the opponent opposite hole pieces on his warehouse (right)
            else if(i == hole_value-1 && value == 0 && cur_hole > game.holes_number>>1 && game.player_move == game.player1){

                if(entity == 420){
                    board[game.holes_number>>1] += board[game.holes_number-cur_hole] + 1;
                    board[game.holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                }

                else{
                    const right_warehouse_value = board[game.holes_number>>1];
                    const right_warehouse_p_value = document.getElementById("right_warehouse_value");
                    const right_warehouse_pieces_area = document.getElementById("right_warehouse_pieces_area");
                    const opposite_hole_value = board[game.holes_number-cur_hole];
                    const opposite_hole_p_value = document.getElementById("hole_value_" + (game.holes_number-cur_hole));
                    const opposite_hole_pieces_area = document.getElementById("hole_pieces_" + (game.holes_number-cur_hole));
                    const hole_p_value = document.getElementById("hole_value_" + cur_hole);
    
                    //updating ui
                    opposite_hole_p_value.innerText = 0;
                    hole_p_value.innerText = 0;
                    right_warehouse_p_value.innerText = right_warehouse_value + opposite_hole_value + 1;
                    //updating board struct
                    board[game.holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                    board[game.holes_number>>1] = right_warehouse_value + opposite_hole_value + 1;

                    //adding pieces to warehouse
                    add_pieces(right_warehouse_pieces_area, opposite_hole_value + 1);

                    //cleaning pieces of opposite hole
                    clean_div(opposite_hole_pieces_area);
                }
            }
            //regular move
            else{
                if(entity == 420){
                    board[cur_hole--]++;
                }
                else{
                    const hole_p_value = document.getElementById("hole_value_" + cur_hole);
                    const hole_pieces_area = document.getElementById("hole_pieces_" + cur_hole);

                    //updating ui
                    hole_p_value.innerText = value + 1;
                    //updating board struct
                    board[cur_hole--] = value + 1;

                    //adding piece to hole
                    add_pieces(hole_pieces_area, 1);
                }
            }
        }

        //initial hole value is decremented by one each iteration
        //a move might iterate more than the *hole_value* (when it skips the opponent warehouse)
        //also if a move iteration goes through the clicked hole the value isnt decreased (only increased) {if i get confused coming back to this later, visualizing this case helps a lot}
        if(board[hole_id] > 0 && cur_hole+1 !== hole_id){
            if(entity == 420){
                board[hole_id]--;
            }
            else{
                clicked_hole_p_value.innerText = parseInt(clicked_hole_p_value.innerText) - 1;
                board[hole_id]--;
            }
        }
        //cur_hole reached -1 value that means left warehouse
        if(cur_hole == -1){
            cur_hole = game.holes_number + 1;
        }
    }

    switch_player_bool == 1 ? (entity == 420 ? switch_player(420) : switch_player()) : null;
    if(entity != 420){
        lock_holes();
        check_board(board, 1);
        if(game.on == 0) document.getElementById("playing").innerText = "";
    }
}

const set_playing = (entity) => {
    //ai stuff..no need to affect visuals
    if(entity == 420) return;

    const playing = document.getElementById("playing");
    const up_holes = document.getElementById("up_holes");
    const down_hole = document.getElementById("down_holes");

    playing.innerText = "Turn: " + game.player_move;
    if(game.player_move == game.player1){
        up_holes.style.borderTopColor = "rgba(246, 191, 240, 0.548)"
        down_hole.style.borderBottomColor = "rgba(122, 27, 153, 0.39)";
    }
    else{
        up_holes.style.borderTopColor = "rgba(122, 27, 153, 0.39)";
        down_hole.style.borderBottomColor = "rgba(246, 191, 240, 0.548)"
    }
}

const switch_player = (entity) => {
    if(game.player_move == game.player1){
        game.player_move = game.player2; 
        set_playing(entity);
    }
    else{
        game.player_move = game.player1;
        set_playing(entity);
    }
}

//called after each move, checks board state
const check_board = (board, entity) => {
    const left_warehouse_value = board[game.holes_number+1];
    const right_warehouse_value = board[game.holes_number>>1];

    let player1_empty_holes = 0;
    let player2_empty_holes = 0;

    //checking holes values
    for(let i=0; i<game.holes_number+1; i++){
        //i != game.holes_number>>1 since right warehouse is placed in between the holes
        if(i != game.holes_number>>1){
            //player 1 hole
            if(i > game.holes_number>>1 && board[i] === 0){
                player1_empty_holes++;
            }
            //player 2 hole
            else if(i < game.holes_number>>1 && board[i] === 0){
                player2_empty_holes++;
            }
        }
    }

    //all holes empty
    if(player1_empty_holes + player2_empty_holes === game.holes_number){
        if(left_warehouse_value === right_warehouse_value){
            if(entity == 420) return 0;
            else{
                game.on = 0;
                alert("Draw");
            }
        }
        else if(left_warehouse_value > right_warehouse_value){
            if(entity == 420) return 2;
            else{
                game.on = 0;  
                alert(game.player2 + " won");
            }
        }
        else{
            if(entity == 420) return 1;
            else{
                game.on = 0;
                alert(game.player1 + " won");
            }
        }
    }
    //player 1 holes empty and its player 1 turn
    else if(player1_empty_holes === game.holes_number>>1 && game.player_move == game.player1){
        //collecting player 2 pieces into his warehouse to check who won
        let pieces = 0;
        for(let i=0; i<game.holes_number>>1; i++){
            pieces += board[i];
            board[i] = 0;
            if(entity != 420) document.getElementById(i).innerText = 0;
        }
        let player1_warehouse;
        let player2_warehouse;
        if(entity == 420){
            player1_warehouse = board[game.holes_number>>1];
            player2_warehouse = board[game.holes_number+1];
        }
        else{
            const left_warehouse_p_value = document.getElementById("left_warehouse_value");
            const left_warehouse_pieces_area = document.getElementById("left_warehouse_pieces_area");

            player2_warehouse = board[game.holes_number+1] + pieces;
            left_warehouse_p_value.innerText = player2_warehouse;
            add_pieces(left_warehouse_pieces_area, pieces);
            player1_warehouse = board[game.holes_number>>1];
        }
        //veredict
        if(player1_warehouse > player2_warehouse){
            if(entity == 420) return 1;
            else{
                game.on = 0;
                alert(game.player1 + " won");
            }
        }
        else if(player1_warehouse < player2_warehouse){
            if(entity == 420) return 2;
            else{
                game.on = 0;
                alert(game.player2 + " won");
            }
        }
        else{
            if(entity == 420) return 0;
            else{
                game.on = 0;
                alert("Draw");
            }
        }
    }
    //player 2 holes empty and its player 2 turn
    else if(player2_empty_holes === game.holes_number>>1 && game.player_move == game.player2){
        //collecting player 1 pieces into his warehouse to check who won
        let pieces = 0;
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            pieces += board[i];
            board[i] = 0;
            if(entity != 420) document.getElementById(i).innerText = 0;
        }
        
        let player1_warehouse;
        let player2_warehouse;
        if(entity == 420){
            player1_warehouse = board[game.holes_number>>1];
            player2_warehouse = board[game.holes_number+1];
        }
        else{
            const right_warehouse_p_value = document.getElementById("right_warehouse_value");
            const right_warehouse_pieces_area = document.getElementById("right_warehouse_pieces_area");

            player1_warehouse = board[game.holes_number>>1] + pieces;
            right_warehouse_p_value.innerText = player1_warehouse;
            add_pieces(right_warehouse_pieces_area, pieces);
            player2_warehouse = board[game.holes_number+1];
        }
        //veredict
        if(player1_warehouse > player2_warehouse){
            if(entity == 420) return 1;
            else{
                game.on = 0;
                alert(game.player1 + " won");
            }
        }
        else if(player1_warehouse < player2_warehouse){
            if(entity == 420) return 2;
            else{
                game.on = 0;
                alert(game.player2 + " won");
            }
        }
        else{
            if(entity == 420) return 0;
            else{
                game.on = 0;
                alert("Draw");
            }
        }
    }
}

const update_board = (p_side, p_warehouse, opp_side, opp_warehouse) => {
    let pieces_diff;
    //update opp holes
    for(let i=0, j=(game.holes_number>>1)-1; i<game.holes_number>>1, j>=0; i++, j--){
        pieces_diff = opp_side[j] - game.board[i];
        game.board[i] = opp_side[j];
        document.getElementById("hole_value_" + i).innerText = opp_side[j];
        update_pieces(document.getElementById("hole_pieces_" + i), pieces_diff);
    }

    //update opp warehouse
    pieces_diff = opp_warehouse - game.board[game.holes_number+1];
    game.board[game.holes_number+1] = opp_warehouse;
    document.getElementById("left_warehouse_value").innerText = opp_warehouse;
    update_pieces(document.getElementById("left_warehouse_pieces_area"), pieces_diff);

    //update user side
    for(let i=game.holes_number, j=0; i>game.holes_number>>1, j<game.holes_number>>1; i--, j++){
        pieces_diff = p_side[j] - game.board[i];
        game.board[i] = p_side[j];
        document.getElementById("hole_value_" + i).innerText = p_side[j];
        update_pieces(document.getElementById("hole_pieces_" + i), pieces_diff);
    }

    //update user warehouse
    pieces_diff = p_warehouse - game.board[game.holes_number>>1];
    game.board[game.holes_number>>1] = p_warehouse;
    document.getElementById("right_warehouse_value").innerText = p_warehouse;
    update_pieces(document.getElementById("right_warehouse_pieces_area"), pieces_diff);
}

const update_pieces = (pieces_area, pieces_diff) => {
    if(pieces_diff > 0){
        add_pieces(pieces_area, Math.abs(pieces_diff));
    }
    else if(pieces_diff < 0){
        remove_pieces(pieces_area, Math.abs(pieces_diff));
    }
    else{
        const murakami = "cool books";
    }
}


const reset_board = () => {
    const left_warehouse_p_value = document.getElementById("left_warehouse_value");
    const right_warehouse_p_value = document.getElementById("right_warehouse_value");

    //reseting left warehouse
    game.board[game.holes_number+1] = 0;
    left_warehouse_p_value.innerText = 0;

    //reseting right warehouse
    game.board[game.holes_number>>1] = 0;
    right_warehouse_p_value.innerText = 0;

    //reseting holes
    for(let i=0; i<game.holes_number+1; i++){
        if(i != game.holes_number>>1){
            game.board[i] = game.holes_value;
            document.getElementById(i).innerText = game.holes_value;
        }
    }
    clean_board_pieces();

    lock_holes();

    set_playing();

    game.initial_player == 1 ? game.initial_player = 2 : game.initial_player = 1;
}