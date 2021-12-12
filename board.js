//best leaf node found
let best;
//next ai move
let ai_hole;

//game object
let game;

class Game{
    constructor(board, player1, player2, initial_player, holes_number, holes_value, game_on) {
      this.board = board;
      this.player1 = player1;
      this.player2 = player2;
      this.initial_player = initial_player;
      this.holes_number = holes_number;
      this.holes_value = holes_value;
      this.player_move = initial_player;
      this.game_on = game_on;
    }

    startGame(){
        loadBoard();
    }
}

const getPLayer1 = () => {
    //to be modified
    return 1;
}

const getPLayer2 = () => {
    //to be modified
    return 420;
}

const getHolesNumber = () => {
    return parseInt(document.getElementById("holes_number").value);
}

const getHolesValue = () => {
    return parseInt(document.getElementById("holes_value").value);
}

const getInitialPLayer = () => {
    return Math.round(Math.random()) + 1;
}

const addClickHoles = () => {
    for(let i=0; i<game.holes_number+1; i++){
        if(i != game.holes_number>>1) document.getElementById(i).addEventListener("click", () => {
            turn(i);
        });
    }
}

const initGame = () => {
    game = new Game([], getPLayer1(), getPLayer2(), getInitialPLayer(), getHolesNumber(), getHolesValue(), 1);
    game.startGame();
    addClickHoles();
    if(game.player_move == 2) turn();
}

const cleanDiv = (container) => {
    while(container.hasChildNodes()){
        container.removeChild(container.firstChild);
    }
}


//loads board
const loadBoard = () => {
    //div containing every board element
    const game_container = document.getElementById("game_container");

    //cleaning up board container div
    cleanDiv(game_container);

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
    
    displayPieces();

    //might change this later
    setPlaying();

    //locking non starting player side/holes
    lockHoles();
}

const randomInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const setPieceSize = (piece, hole_value) => {
    if(hole_value <= 17){
        piece.style.height = "0.8vh";
        piece.style.width = "0.8vh";
    }
    else{
        piece.style.height = "0.6vh";
        piece.style.width = "0.6vh";
    }
}

const displayPieces = () => {
    for(let i=0; i<=game.holes_number; i++){
        if(i != game.holes_number>>1){
            for(let j=0; j<game.board[i]; j++){
                addPiece("hole_pieces_" + i, 1, game.board[i]);
            }
        }
    }
}

const cleanPieces = (container) => {
    const pieces_area = document.getElementById(container);
    while(pieces_area.hasChildNodes()){
        pieces_area.removeChild(pieces_area.firstChild);
    }
}

const addPiece = (container, value_to_add, value) => {
    const pieces_area = document.getElementById(container);
    const pieces_area_height = pieces_area.offsetHeight;
    const pieces_area_width = pieces_area.offsetWidth;
    let piece; 
    for(let i=0; i<value_to_add; i++){
        piece = document.createElement("div");
        piece.setAttribute("class", "piece");
        setPieceSize(piece, value);
        piece.style.left = randomInterval(10, pieces_area_width-30).toString()+"px";
        piece.style.top = randomInterval(10, pieces_area_height-30).toString()+"px";
        pieces_area.appendChild(piece);
    }

}

const getNextAIMove = () => {
    let save_player_move = game.player_move;
    let ai_move_hole = calculateAIMove(7);
    game.player_move = save_player_move;
    setPlaying();
    console.log("nextAIMove: "+ai_move_hole);
    onHoleClick(game.board, ai_move_hole);
}

const lockHoles = () => {
    //unlocking player 1 holes/locking player 2 holes
    if(game.player_move === 1){
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            //only make it clickable if value isnt 0
            if(parseInt(document.getElementById(i).innerText) !== 0){
                document.getElementById(i).style.pointerEvents = 'auto';
            }
            else{
                document.getElementById(i).style.pointerEvents = 'none';
            }
        }
        for(let i=0; i<game.holes_number>>1; i++){
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }
    //unlocking player 2 holes/locking player 1 holes
    else{
        for(let i=0; i<game.holes_number>>1; i++){
            //only make it clickable if value isnt 0
            if(parseInt(document.getElementById(i).innerText) !== 0){
                document.getElementById(i).style.pointerEvents = 'auto';
            }
            else{
                document.getElementById(i).style.pointerEvents = 'none';
            }
        }
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }
}

const calculateAIMove = (depth) => {
    best = -999999;
    let move = jjjjj_ai(game.board.slice(), 2, depth, -1);
    return move.hole;
}

//this version which is the minimax in its truest form plays so bad...mine (below this one) player a lot better
const jjjjj_ai = (board, entity, depth, initial_hole) => {
    let board_state_saved = board.slice();
    let node_value = board[game.holes_number+1] - board[game.holes_number>>1];
    if(depth == 0 ||
        checkBoard(board.slice(), 420) == 0 ||
        checkBoard(board.slice(), 420) == 1 ||
        checkBoard(board.slice(), 420) == 2)
    {
        /* if(node_value > best){
            best = node_value;
            ai_hole = initial_hole;
        } */
        let leaf = {value: node_value, hole: 0};
        return leaf;
    }
    else if(entity == 2){
        let alpha = {value: -9999, hole: -1};
        for(let i=0; i<game.holes_number>>1; i++){
            if(board[i] != 0){
                alpha.hole = i;
                game.player_move = entity;
                onHoleClick(board, i, 420);
                alpha.value = Math.max(alpha.value, jjjjj_ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole).value);
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
                onHoleClick(board, i, 420);
                alpha.value = Math.min(alpha.value, jjjjj_ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole).value);
                board = board_state_saved.slice();
            }
        }
        return alpha;
    }
}

//for some reason (that i dont understand) depth 7 plays better than depth 10...
/* const jjjjj_ai = (board, entity, depth, initial_hole) => {
    let board_state_saved = board.slice();
    let node_value = board[game.holes_number+1] - board[game.holes_number>>1];
    if(depth == 0 || checkBoard(board.slice(), 420) == 2){
        if(node_value > best){
            best = node_value;
            ai_hole = initial_hole;
        }
        return node_value;
    }
    else if(entity == 2){
        for(let i=0; i<game.holes_number>>1; i++){
            if(board[i] != 0){
                game.player_move = entity;
                onHoleClick(board, i, 420);
                jjjjj_ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole);
                board = board_state_saved.slice();
            }
        }
        return node_value;
    }
    else{
        for(let i=game.holes_number; i>game.holes_number>>1; i--){
            if(board[i] != 0){
                game.player_move = entity;
                onHoleClick(board, i, 420);
                jjjjj_ai(board, game.player_move, depth-1, initial_hole == -1 ? i : initial_hole);
                board = board_state_saved.slice();
            }
        }
        return node_value;
    }
} */

const turn = async (id) => {
    game.player_move == 1 ? onHoleClick(game.board, id, 1) : null;
    while(game.player_move == 2 && game.game_on == 1){
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
    if((game.player_move == 1 && hole_id < game.holes_number>>1) || (game.player_move == 2 && hole_id > game.holes_number>>1)) return;
    //clicked hole p element that contains the current value
    const p_hole = document.getElementById("hole_value_"+hole_id);
    //clean hole pieces
    if(entity != 420) cleanPieces("hole_pieces_" + hole_id);
    //get hole current value
    const hole_value = entity == 420 ? board[parseInt(hole_id)] : parseInt(p_hole.innerText);
    //get next hole index
    let cur_hole = parseInt(hole_id) == 0 ? game.holes_number + 1 : parseInt(hole_id) - 1;
    //does it switch player after the move
    let switch_player = 1;
    //traversing board *hole_value* times 
    for(let i=0; i<hole_value; i++){
        //left warehouse was reached and its value is incremented by one
        if(cur_hole === game.holes_number+1){
            //player 1 move so opponent warehouse (left one) skipped
            if(game.player_move === 1){
                i--;
                cur_hole--;
            }
            //regular move
            else{
                //player 2 last piece landed on its own warehouse so he keeps playing
                if(i === hole_value-1){
                    switch_player = 0;
                }
                //ai search space processing related
                if(entity === 420){
                    board[cur_hole--]++;
                }
                else{
                    const value = board[game.holes_number+1];
                    //updating ui
                    document.getElementById("left_warehouse_value").innerText = value + 1;
                    //updating board struct
                    board[cur_hole] = value + 1;
                    //adding piece to warehouse
                    addPiece("left_warehouse_pieces_area", 1, board[cur_hole--]);
                }
            }
        }
        //right warehouse was reached and its value is incremented by one
        else if(cur_hole === game.holes_number>>1){
            //player 2 move so opponent warehouse (right one) skipped
            if(game.player_move === 2){
                i--;
                cur_hole--;
            }
            //regular move
            else{
                //player 1 last piece landed on its own warehouse so he keeps playing
                if(i === hole_value-1){
                    switch_player = 0;
                }
                //ai search space processing related
                if(entity === 420){
                    board[cur_hole--]++;
                }
                else{
                    const value = board[game.holes_number>>1];
                    //updaing ui
                    document.getElementById("right_warehouse_value").innerText = value + 1;
                    //updating board struct
                    board[cur_hole] = value + 1;
                    //adding piece to warehouse
                    addPiece("right_warehouse_pieces_area", 1, board[cur_hole--]);
                }
            }
        }
        //*cur_hole* hole was reached and its value is incremented by one 
        else{
            const value = board[cur_hole];

            //when player 2 last iteration move lands on one of its own side empty hole
            //he then gets that last piece plus the opponent opposite hole pieces on his warehouse (left)
            if(i === hole_value-1 && value === 0 && cur_hole < game.holes_number>>1 && game.player_move == 2){
                //player 2 plays next turn aswell
                switch_player = 0;
                
                //ai search space processing related
                if(entity == 420){
                    board[game.holes_number+1] += board[game.holes_number-cur_hole] + 1;
                    board[game.holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                }

                else{
                    const warehouse_value = board[game.holes_number+1];
                    const opponent_opposite_hole_value = board[game.holes_number-cur_hole];

                    //updating ui and board struct
                    document.getElementById("hole_value_" + (game.holes_number-cur_hole)).innerText = 0;
                    board[game.holes_number-cur_hole] = 0;
                    document.getElementById("hole_value_" + cur_hole).innerText = 0;
                    board[cur_hole] = 0;                
                    document.getElementById("left_warehouse_value").innerText = warehouse_value + opponent_opposite_hole_value + 1;
                    board[game.holes_number+1] = warehouse_value + opponent_opposite_hole_value + 1;

                    //adding pieces to warehouse
                    addPiece("left_warehouse_pieces_area", opponent_opposite_hole_value + 1, board[game.holes_number+1]);

                    //cleaning pieces of opposite hole
                    cleanPieces("hole_pieces_" + (game.holes_number-(cur_hole--)));
                }
            }
            //when player 1 last iteration move lands on one of its own side empty hole
            //he then gets that last piece plus the opponent opposite hole pieces on his warehouse (right)
            else if(i === hole_value-1 && value === 0 && cur_hole > game.holes_number>>1 && game.player_move == 1){
                //player 1 plays next turn aswell
                switch_player = 0;

                if(entity == 420){
                    board[game.holes_number>>1] += board[game.holes_number-cur_hole] + 1;
                    board[game.holes_number-cur_hole] = 0;
                    board[cur_hole--] = 0;
                }

                else{
                    const warehouse_value = board[game.holes_number>>1];
                    const opponent_opposite_hole_value = board[game.holes_number-cur_hole]; //CHECK IF NO ERRORS
    
                    //updating ui and board struct
                    document.getElementById("hole_value_" + (game.holes_number-cur_hole)).innerText = 0;
                    board[game.holes_number-cur_hole] = 0;
                    document.getElementById("hole_value_" + cur_hole).innerText = 0;
                    board[cur_hole] = 0;
                    document.getElementById("right_warehouse_value").innerText = warehouse_value + opponent_opposite_hole_value + 1;
                    board[game.holes_number>>1] = warehouse_value + opponent_opposite_hole_value + 1;

                    //adding pieces to warehouse
                    addPiece("right_warehouse_pieces_area", opponent_opposite_hole_value + 1, board[game.holes_number>>1]);

                    //cleaning pieces of opposite hole
                    cleanPieces("hole_pieces_" + (game.holes_number-(cur_hole--)));
                }
            }
            //regular move
            else{
                if(entity == 420){
                    board[cur_hole--]++;
                }
                else{
                    //updating ui
                    document.getElementById("hole_value_" + cur_hole).innerText = value + 1;
                    //updating board struct
                    board[cur_hole] = value + 1;

                    //adding piece to hole
                    addPiece("hole_pieces_" + cur_hole, 1, board[cur_hole--]);
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
                p_hole.innerText = parseInt(p_hole.innerText) - 1;
                board[hole_id]--;
            }
        }
        //cur_hole reached -1 value that means left warehouse
        if(cur_hole == -1){
            cur_hole = game.holes_number + 1;
        }
    }

    switch_player === 1 ? (entity == 420 ? switchPlayer(420) : switchPlayer()) : null;
    if(entity != 420){
        lockHoles();
        checkBoard(board, 1);
    }
}

const setPlaying = (entity) => {
    //ai stuff..no need to affect visuals
    if(entity == 420) return;

    document.getElementById("playing").innerText = "Playing: Player " + game.player_move;
    if(game.player_move == 1){
        document.getElementById("down_holes").style.borderBottomColor = "rgba(122, 27, 153, 0.39)";
        document.getElementById("up_holes").style.borderTopColor = "rgba(246, 191, 240, 0.548)"
    }
    else{
        document.getElementById("up_holes").style.borderTopColor = "rgba(122, 27, 153, 0.39)";
        document.getElementById("down_holes").style.borderBottomColor = "rgba(246, 191, 240, 0.548)"
    }
}

const switchPlayer = (entity) => {
    if(game.player_move === 1){
        game.player_move = 2; 
        setPlaying(entity);
    }
    else{
        game.player_move = 1;
        setPlaying(entity);
    }
}

//called after each move, checks board state
const checkBoard = (board, entity) => {
    const left_warehouse = board[game.holes_number+1];
    const right_warehouse = board[game.holes_number>>1];

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
    else if(player1_empty_holes === game.holes_number>>1 && game.player_move === 1){
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
            player2_warehouse = board[game.holes_number+1] + pieces;
            document.getElementById("left_warehouse_value").innerText = player2_warehouse;
            addPiece("left_warehouse_pieces_area", pieces, player2_warehouse);
            player1_warehouse = board[game.holes_number>>1];
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
    else if(player2_empty_holes === game.holes_number>>1 && game.player_move === 2){
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
            player1_warehouse = board[game.holes_number>>1] + pieces;
            document.getElementById("right_warehouse_value").innerText = player1_warehouse;
            addPiece("right_warehouse_pieces_area", pieces, player1_warehouse);
            player2_warehouse = board[game.holes_number+1];
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
    game.board[game.holes_number+1] = 0;
    document.getElementById("left_warehouse_value").innerText = 0;

    //reseting right warehouse
    game.board[game.holes_number>>1] = 0;
    document.getElementById("right_warehouse_value").innerText = 0;

    //reseting holes
    for(let i=0; i<game.holes_number+1; i++){
        if(i != game.holes_number>>1){
            game.board[i] = game.holes_value;
            document.getElementById(i).innerText = game.holes_value;
        }
    }

    lockHoles();

    setPlaying();

    game.initial_player == 1 ? game.initial_player = 2 : game.initial_player = 1;
}
