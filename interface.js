//popup screens
let rules_popup = document.getElementById("rules_popup");
let play_popup = document.getElementById("play_popup");
let register_popup = document.getElementById("register_popup");

//buttons
let rules_button = document.getElementById("rules_button");
let play_button = document.getElementById("play_button");
let reset_board_button = document.getElementById("reset_board_button");
let start_game_button = document.getElementById("start_game_button");
let register_button = document.getElementById("register_button");

//close popup buttons
let close_rules_popup = document.getElementsByClassName("close")[0];
let close_play_popup = document.getElementsByClassName("close")[1];
let close_register_popup = document.getElementsByClassName("close")[2];

//initialize game
start_game_button.onclick = () => {
  initGame();
  document.getElementById("play_popup").style.display = "none";
  play_popup.style.pointerEvents = 'auto';
  reset_board_button.style.pointerEvents = 'auto';
}

//reset game board
reset_board_button.onclick = () => {
  resetBoard();
}

//open rules popup
rules_button.onclick = () => {
  play_popup.style.display = "none";
  register_popup.style.display = "none";
  rules_popup.style.display = "block";
}

//open play popup
play_button.onclick = () => {
  rules_popup.style.display = "none";
  register_popup.style.display = "none";
  play_popup.style.display = "block";
}

//open register popup
register_button.onclick = () => {
  rules_popup.style.display = "none";
  play_popup.style.display = "none";
  register_popup.style.display = "block";
}

//close rules popup by clicking X
close_rules_popup.onclick = () => {
  rules_popup.style.display = "none";
}

//close play popup by clicking X
close_play_popup.onclick = () => {
  play_popup.style.display = "none";
}

//close register popup by clicking X
close_register_popup.onclick = () => {
  register_popup.style.display = "none";
  clean_register_update_message();
  clean_register_input();
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
}