//popup screens
let rules_popup = document.getElementById("rules_popup");
let play_popup = document.getElementById("play_popup");
let login_popup = document.getElementById("login_popup");
let register_popup = document.getElementById("register_popup");
let ranking_popup = document.getElementById("ranking_popup");

//buttons
let rules_button = document.getElementById("rules_button");
let play_button = document.getElementById("play_button");
//let reset_board_button = document.getElementById("reset_board_button");
let start_game_button = document.getElementById("start_game_button");
//let login_button = document.getElementById("login_button");
let register_button = document.getElementById("register_button");
let ranking_button = document.getElementById("ranking_button");

//close popup buttons
let close_rules_popup = document.getElementsByClassName("close")[0];
let close_play_popup = document.getElementsByClassName("close")[1];
let close_register_popup = document.getElementsByClassName("close")[2];
let close_ranking_popup = document.getElementsByClassName("close")[3];
/* let close_login_popup = document.getElementsByClassName("close")[3]; */

//initialize game
start_game_button.onclick = () => {
  logged_username = document.getElementById("nick").value;
  logged_password = document.getElementById("pw").value;
  init_game();
  document.getElementById("play_popup").style.display = "none";
  play_popup.style.pointerEvents = 'auto';
  //reset_board_button.style.pointerEvents = 'auto';
}

//reset game board
/* reset_board_button.onclick = () => {
  resetBoard();
} */

//open rules popup
rules_button.onclick = () => {
  play_popup.style.display = "none";
  register_popup.style.display = "none";
  //login_popup.style.display = "none";
  ranking_popup.style.display = "none";
  rules_popup.style.display = "block";
  clean_ranking();
}

//open play popup
play_button.onclick = () => {
  rules_popup.style.display = "none";
  register_popup.style.display = "none";
  //login_popup.style.display = "none";
  ranking_popup.style.display = "none";
  play_popup.style.display = "block";
  clean_ranking();
}

//open login popup
/* login_button.onclick = () => {
  rules_popup.style.display = "none";
  register_popup.style.display = "none";
  login_popup.style.display = "block";
} */

//open register popup
register_button.onclick = () => {
  rules_popup.style.display = "none";
  play_popup.style.display = "none";
  //login_popup.style.display = "none";
  ranking_popup.style.display = "none";
  register_popup.style.display = "block";
  clean_ranking();
}

//open ranking popup
ranking_button.onclick = () => {
  rules_popup.style.display = "none";
  play_popup.style.display = "none";
  //login_popup.style.display = "none";
  register_popup.style.display = "none";
  ranking_popup.style.display = "block";
  ranking();
}

//close rules popup by clicking X
close_rules_popup.onclick = () => {
  rules_popup.style.display = "none";
}

//close play popup by clicking X
close_play_popup.onclick = () => {
  play_popup.style.display = "none";
}

//close login popup by clicking X
/* close_login_popup.onclick = () => {
  login_popup.style.display = "none";
} */

//close register popup by clicking X
close_register_popup.onclick = () => {
  register_popup.style.display = "none";
  clean_register_update_message();
  clean_register_input();
}

//close ranking popup by clicking X
close_ranking_popup.onclick = () => {
  ranking_popup.style.display = "none";
  clean_ranking();
}

//close any popup by clicking outside of popup area
window.onclick = function(event) {
  if (event.target == rules_popup) {
    rules_popup.style.display = "none";
  }
  else if(event.target == play_popup){
    play_popup.style.display = "none";
  }
  else if(event.target == register_popup){
    clean_register_update_message();
   register_popup.style.display = "none";
  }
  else if(event.target == ranking_popup){
    ranking_popup.style.display = "none";
    clean_ranking();
  }
  /* else if(event.target == login_popup){
   login_popup.style.display = "none";
  } */
}