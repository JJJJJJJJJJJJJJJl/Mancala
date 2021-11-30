//board configuration 
//total number of holes except warehouses (this value must be even!!)
let holes_number = -1;
//number of stones each hole get when the game starts 
let initial_hole_value = -1;
//initial player
let initial_player = 1;

//array storing board current state
let board_state = [];

//keeps state of whos playing in the specific turn
//offline version - player 1(down) starts by default
let player_move;

//best leaf node found
let best;
//next ai move
let ai_hole;

//game object
let game;

class Game{
    constructor(board, player1, player2, game_on) {
      this.board = board;
      this.player1 = player1;
      this.player2 = player2;
      this.game_on = game_on;
    }

    startGame(){
        loadBoard();
    }
}

const initGame = () => {
    document.getElementById("play_popup").style.display = "none";
    game = new Game(board_state, 1, 420, 1);
    game.startGame();
    for(let i=0; i<holes_number+1; i++){
        if(i != holes_number>>1) document.getElementById(i).addEventListener("click", () => {
            turn(i);
        });
    }
    if(player_move == 2) turn();
}

const cleanBoard = (container) => {
    while(container.hasChildNodes()){
        container.removeChild(container.firstChild);
    }
}


//loads board
const loadBoard = () => {
    //div containing every board element
    const container = document.getElementById("game_container");

    //cleaning up board container div
    cleanBoard(container);

    //selected number of initial holes
    holes_number = parseInt(document.getElementById("hole_number").value);
    //selected inital holes value
    initial_hole_value = parseInt(document.getElementById("hole_value").value);

    //div represeting the left side warehouse
    const left_warehouse = document.createElement("div");
    left_warehouse.setAttribute("id", "left_warehouse");
    left_warehouse.setAttribute("class", "warehouse");
    board_state[holes_number+1] = 0;
    left_warehouse.innerText = board_state[holes_number+1];
    
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
    right_warehouse.setAttribute("id", "right_warehouse");
    right_warehouse.setAttribute("class", "warehouse");
    board_state[holes_number>>1] = 0;
    right_warehouse.innerText = board_state[holes_number>>1];
    
    //creating each individual hole and assigning them the starting_hole_number value 
    for(let i=0; i<holes_number+1; i++){
        const new_hole = document.createElement("div");
        
        //assigning each hole its index
        if(i < holes_number>>1){
            new_hole.setAttribute("id", i);
            new_hole.setAttribute("class", "hole up");
            //new_hole.setAttribute("onclick", "onHoleClick(board_state, " + i + ")");
            board_state[i] = initial_hole_value;
            new_hole.innerText = board_state[i];
            up_holes.appendChild(new_hole);
        }
        else if(i > holes_number>>1){
            const diff = i - (holes_number>>1);
            const index = (holes_number+1) - diff;

            new_hole.setAttribute("id", index);
            new_hole.setAttribute("class", "hole down");
            //new_hole.setAttribute("onclick", "onHoleClick(board_state, " + index + ")");
            board_state[index] = initial_hole_value;
            new_hole.innerText = board_state[index];
            down_holes.appendChild(new_hole);
        }
    }
    //wrapping
    holes.appendChild(up_holes);
    holes.appendChild(down_holes);
    container.appendChild(left_warehouse);
    container.appendChild(holes);
    container.appendChild(right_warehouse);

    //setting initial player based on configuration
    initial_player = Math.round(Math.random()) + 1;
    player_move = initial_player;

    //might change this later
    setPlaying();

    //locking non starting player side/holes
    lockHoles();
}

const getNextAIMove = () => {
    let save_player_move = player_move;
    calculateAIMove(7);
    player_move = save_player_move;
    setPlaying();
    console.log("nextAIMove: "+ai_hole);
    onHoleClick(game.board, ai_hole);
}

const lockHoles = () => {
    //unlocking player 1 holes/locking player 2 holes
    if(player_move === 1){
        for(let i=holes_number; i>holes_number>>1; i--){
            //only make it clickable if value isnt 0
            if(parseInt(document.getElementById(i).innerText) !== 0){
                document.getElementById(i).style.pointerEvents = 'auto';
            }
            else{
                document.getElementById(i).style.pointerEvents = 'none';
            }
        }
        for(let i=0; i<holes_number>>1; i++){
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }
    //unlocking player 2 holes/locking player 1 holes
    else{
        for(let i=0; i<holes_number>>1; i++){
            //only make it clickable if value isnt 0
            if(parseInt(document.getElementById(i).innerText) !== 0){
                document.getElementById(i).style.pointerEvents = 'auto';
            }
            else{
                document.getElementById(i).style.pointerEvents = 'none';
            }
        }
        for(let i=holes_number; i>holes_number>>1; i--){
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }
}

const calculateAIMove = (depth) => {
    best = -999999;
    return jjjjj_ai(board_state.slice(), 2, depth, -1);
}

//for some reason (that i dont understand) depth 7 plays better than depth 10...
const jjjjj_ai = (board, entity, depth, initial_hole) => {
    let board_state_saved = board.slice();
    let node_value = board[holes_number+1] - board[holes_number>>1];
    if(depth == 0 || checkBoard(board.slice(), 420)){
        if(node_value > best){
            best = node_value;
            ai_hole = initial_hole;
        }
        return node_value;
    }
    else if(entity == 2){
        for(let i=0; i<holes_number>>1; i++){
            if(board[i] != 0){
                player_move = entity;
                onHoleClick(board, i, 420);
                jjjjj_ai(board, player_move, depth-1, initial_hole == -1 ? i : initial_hole);
                board = board_state_saved.slice();
            }
        }
        return node_value;
    }
    else{
        for(let i=holes_number; i>holes_number>>1; i--){
            if(board[i] != 0){
                player_move = entity;
                onHoleClick(board, i, 420);
                jjjjj_ai(board, player_move, depth-1, initial_hole == -1 ? i : initial_hole);
                board = board_state_saved.slice();
            }
        }
        return node_value;
    }
}

const turn = async (id) => {
    player_move == 1 ? onHoleClick(game.board, id, 1) : null;
    while(player_move == 2 && game.game_on == 1){
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(getNextAIMove());
            }, 2000);
        });
    }
}

//handles each game move
const onHoleClick = (board, hole_id, entity) => {
    //is game still on
    if(game.game_on == 0) return;
    //is it a valid move
    if((player_move == 1 && hole_id < holes_number>>1) || (player_move == 2 && hole_id > holes_number>>1)) return;
    //get clicked hole
    const hole = document.getElementById(hole_id);
    //get hole current value
    const hole_value = entity === 420 ? board[parseInt(hole_id)] : parseInt(hole.innerText);
    //get next hole index
    let cur_hole = parseInt(hole_id) === 0 ? holes_number + 1 : parseInt(hole_id) - 1;
    //does it switch player after the move
    let switch_player = 1;
    //traversing board *hole_value* times 
    for(let i=0; i<hole_value; i++){
        //left warehouse was reached and its value is incremented by one
        if(cur_hole === holes_number+1){
            //player 1 move so opponent warehouse (left one) skipped
            if(player_move === 1){
                i--;
                cur_hole--;
            }
            //regular move
            else{
                //player 2 last piece landed on its own warehouse so he keeps playing
                if(i === hole_value-1){
                    switch_player = 0;
                }
                if(entity === 420){
                    board[cur_hole--]++;
                }
                else{
                    const value = board[holes_number+1];
                    document.getElementById("left_warehouse").innerText = value + 1;
                    board[cur_hole--] = value + 1;
                }
            }
        }
        //right warehouse was reached and its value is incremented by one
        else if(cur_hole === holes_number>>1){
            //player 2 move so opponent warehouse (right one) skipped
            if(player_move === 2){
                i--;
                cur_hole--;
            }
            //regular move
            else{
                //player 1 last piece landed on its own warehouse so he keeps playing
                if(i === hole_value-1){
                    switch_player = 0;
                }
                if(entity === 420){
                    board[cur_hole--]++;
                }
                else{
                    const value = board[holes_number>>1];
                    document.getElementById("right_warehouse").innerText = value + 1;
                    board[cur_hole--] = value + 1;
                }
            }
        }
        //*cur_hole* hole was reached and its value is incremented by one 
        else{
            const value = board[cur_hole];

            //when player 2 last iteration move lands on one of its own side empty hole
            //he then gets that last piece plus the opponent opposite hole pieces on his warehouse (left)
            if(i === hole_value-1 && value === 0 && cur_hole < holes_number>>1 && player_move == 2){
                //player 2 plays next turn aswell
                switch_player = 0;
                
                if(entity == 420){
                    board[holes_number+1] += board[holes_number-cur_hole] + 1;
                    board[holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                }

                else{
                    const warehouse_value = board[holes_number+1];
                    const opponent_opposite_hole_value = board[holes_number-cur_hole];
    
                    document.getElementById(holes_number-cur_hole).innerText = 0;
                    board[holes_number-cur_hole] = 0;
                    document.getElementById(cur_hole).innerText = 0;
                    board[cur_hole--] = 0;                
                    document.getElementById("left_warehouse").innerText = warehouse_value + opponent_opposite_hole_value + 1;
                    board[holes_number+1] = warehouse_value + opponent_opposite_hole_value + 1;
                }
            }
            //when player 1 last iteration move lands on one of its own side empty hole
            //he then gets that last piece plus the opponent opposite hole pieces on his warehouse (right)
            else if(i === hole_value-1 && value === 0 && cur_hole > holes_number>>1 && player_move == 1){
                //player 1 plays next turn aswell
                switch_player = 0;

                if(entity == 420){
                    board[holes_number>>1] += board[holes_number-cur_hole] + 1;
                    board[holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                }

                else{
                    const warehouse_value = board[holes_number>>1];
                    const opponent_opposite_hole_value = parseInt(document.getElementById(holes_number-cur_hole).innerText);
    
                    document.getElementById(holes_number-cur_hole).innerText = 0;
                    board[holes_number-cur_hole] = 0;
                    document.getElementById(cur_hole).innerText = 0;
                    board[cur_hole--] = 0;
                    document.getElementById("right_warehouse").innerText = warehouse_value + opponent_opposite_hole_value + 1;
                    board[holes_number>>1] = warehouse_value + opponent_opposite_hole_value + 1;
                }
            }
            //regular move
            else{
                if(entity == 420){
                    board[cur_hole--]++;
                }
                else{
                    document.getElementById(cur_hole).innerText = value + 1;
                    board[cur_hole--] = value + 1;
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
                hole.innerText = parseInt(hole.innerText) - 1;
                board[hole_id]--;
            }
        }
        //cur_hole reached -1 value that means left warehouse
        if(cur_hole == -1){
            cur_hole = holes_number + 1;
        }
    }

    switch_player === 1 ? (entity == 420 ? switchPlayer(420) : switchPlayer()) : null;
    if(entity != 420){
        lockHoles();
        checkBoard(board, 1);
    }
}

const setPlaying = (j) => {
    //ai stuff..no need to affect visuals
    if(j == 420) return;

    document.getElementById("playing").innerText = "Playing: Player " + player_move;
    if(player_move == 1){
        document.getElementById("down_holes").style.borderBottomColor = "rgba(122, 27, 153, 0.39)";
        document.getElementById("up_holes").style.borderTopColor = "rgba(246, 191, 240, 0.548)"
    }
    else{
        document.getElementById("up_holes").style.borderTopColor = "rgba(122, 27, 153, 0.39)";
        document.getElementById("down_holes").style.borderBottomColor = "rgba(246, 191, 240, 0.548)"
    }
}

const switchPlayer = (entity) => {
    if(player_move === 1){
        player_move = 2; 
        setPlaying(entity);
    }
    else{
        player_move = 1;
        setPlaying(entity);
    }
}

//called after each move, checks board state
const checkBoard = (board, entity) => {
    const left_warehouse = board[holes_number+1];
    const right_warehouse = board[holes_number>>1];

    let player1_empty_holes = 0;
    let player2_empty_holes = 0;

    //checking holes values
    for(let i=0; i<holes_number+1; i++){
        //i != holes_number>>1 since right warehouse is placed in between the holes
        if(i != holes_number>>1){
            //player 1 hole
            if(i > holes_number>>1 && board[i] === 0){
                player1_empty_holes++;
            }
            //player 2 hole
            else if(i < holes_number>>1 && board[i] === 0){
                player2_empty_holes++;
            }
        }
    }

    //all holes empty
    if(player1_empty_holes + player2_empty_holes === holes_number){
        if(left_warehouse === right_warehouse){
            if(entity == 420) return 0;
            else{
                game.game_on = 0;
                alert("Draw");
            }
        }
        else if(left_warehouse > right_warehouse){
            if(entity == 420) return 2;
            else{
                game.game_on = 0;  
                alert("Player 2 won");
            }
        }
        else{
            if(entity == 420) return 1;
            else{
                game.game_on = 0;
                alert("Player 1 won");
            }
        }
    }
    //player 1 holes empty and its player 1 turn
    else if(player1_empty_holes === holes_number>>1 && player_move === 1){
        //collecting player 2 pieces into his warehouse to check who won
        let pieces = 0;
        for(let i=0; i<holes_number>>1; i++){
            pieces += board[i];
            board[i] = 0;
            if(entity != 420) document.getElementById(i).innerText = 0;
        }
        let player1_warehouse;
        let player2_warehouse;
        if(entity == 420){
            player1_warehouse = board[holes_number>>1];
            player2_warehouse = board[holes_number+1];
        }
        else{
            player2_warehouse = board[holes_number+1] + pieces;
            document.getElementById("left_warehouse").innerText = player2_warehouse;
            player1_warehouse = board[holes_number>>1];;
        }
        //veredict
        if(player1_warehouse > player2_warehouse){
            if(entity == 420) return 1;
            else{
                game.game_on = 0;
                alert("Player 1 won");
            }
        }
        else if(player1_warehouse < player2_warehouse){
            if(entity == 420) return 2;
            else{
                game.game_on = 0;
                alert("Player 2 won");
            }
        }
        else{
            if(entity == 420) return 0;
            else{
                game.game_on = 0;
                alert("Draw");
            }
        }
    }
    //player 2 holes empty and its player 2 turn
    else if(player2_empty_holes === holes_number>>1 && player_move === 2){
        //collecting player 1 pieces into his warehouse to check who won
        let pieces = 0;
        for(let i=holes_number; i>holes_number>>1; i--){
            pieces += board[i];
            board[i] = 0;
            if(entity != 420) document.getElementById(i).innerText = 0;
        }
        
        let player1_warehouse;
        let player2_warehouse;
        if(entity == 420){
            player1_warehouse = board[holes_number>>1];
            player2_warehouse = board[holes_number+1];
        }
        else{
            player1_warehouse = board[holes_number>>1] + pieces;
            document.getElementById("right_warehouse").innerText = player1_warehouse;
            player2_warehouse = board[holes_number+1];;
        }
        //veredict
        if(player1_warehouse > player2_warehouse){
            if(entity == 420) return 1;
            else{
                game.game_on = 0;
                alert("Player 1 won");
            }
        }
        else if(player1_warehouse < player2_warehouse){
            if(entity == 420) return 2;
            else{
                game.game_on = 0;
                alert("Player 2 won");
            }
        }
        else{
            if(entity == 420) return 0;
            else{
                game.game_on = 0;
                alert("Draw");
            }
        }
    }
}

const resetBoard = () => {
    //reseting left warehouse
    board_state[holes_number+1] = 0;
    document.getElementById("left_warehouse").innerText = 0;

    //reseting right warehouse
    board_state[holes_number>>1] = 0;
    document.getElementById("right_warehouse").innerText = 0;

    //reseting holes
    for(let i=0; i<holes_number+1; i++){
        if(i != holes_number>>1){
            board_state[i] = initial_hole_value;
            document.getElementById(i).innerText = initial_hole_value;
        }
    }

    //same application as in loadBoard
    lockHoles();

    setPlaying();

    document.getElementById("start_game").style.pointerEvents = 'auto';

    initial_player == 1 ? initial_player = 2 : initial_player = 1;
}
