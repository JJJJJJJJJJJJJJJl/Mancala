//popup screens
let rules_popup = document.getElementById("rules_popup");
let play_popup = document.getElementById("play_popup");

//buttons
let rules_popup_button = document.getElementById("rules_button");
let play_button = document.getElementById("play_button");
let reset_board_button = document.getElementById("reset_board_button");
let start_game_button = document.getElementById("start_game_button");

//close popup buttons
let close_rules_popup = document.getElementsByClassName("close")[0];
let close_play_popup = document.getElementsByClassName("close")[1];

//initialize game
start_game_button.onclick = function() {
  initGame();
  document.getElementById("play_popup").style.display = "none";
  play_popup.style.pointerEvents = 'auto';
  reset_board_button.style.pointerEvents = 'auto';
}

//reset game board
reset_board_button.onclick = function() {
  resetBoard();
}

//open rules popup
rules_popup_button.onclick = function() {
  play_popup.style.display = "none";
  rules_popup.style.display = "block";
}

//open play popup
play_button.onclick = function() {
  rules_popup.style.display = "none";
  play_popup.style.display = "block";
}

//close rules popup by clicking X
close_rules_popup.onclick = function() {
  rules_popup.style.display = "none";
}

//close play popup by clicking X
close_play_popup.onclick = function() {
  play_popup.style.display = "none";
}

//close any popup by clicking outside of popup area
window.onclick = function(event) {
  if (event.target == rules_popup) {
    rules_popup.style.display = "none";
  }
  else if(event.target == play_popup){
    play_popup.style.display = "none";
  }
}