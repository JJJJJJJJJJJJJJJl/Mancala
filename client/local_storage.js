const update_results_ai_games = (winner, loser) => {
    let results = window.localStorage.getItem('results');
    results = JSON.parse(results);
    
    if(results != undefined){
        if(winner == 'user'){
            if(loser == 'ai'){
                results.user_x_ai_minimax.user += 1;
            }
            else if(loser == 'jjjjjj_ai'){
                results.user_x_ai_jjjjjj.user += 1;
            }
            else{
                console.log("how tf u got here \\O/");
            }
        }
        else if(winner == 'ai'){
            results.user_x_ai_minimax.ai_minimax += 1;
        }
        else if(winner == 'jjjjjj_ai'){
            results.user_x_ai_jjjjjj.ai_jjjjjj += 1;
        }
        else{
            console.log("draw \\O/");
        }
        window.localStorage.setItem('results', JSON.stringify(results));
    }
    else{
        const res = {user_x_ai_minimax: {user: 0, ai_minimax: 0}, user_x_ai_jjjjjj: {user: 0, ai_jjjjjj: 0}};
        window.localStorage.setItem('results', JSON.stringify(res));
        update_results_ai_games(winner, loser);
    }
}