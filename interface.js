window.onload = function() {
  document.getElementById("reset_game").style.pointerEvents = 'none';
};

let rules_popup = document.getElementById("rules_popup");
let play_popup = document.getElementById("play_popup");
let rules_popup_button = document.getElementById("rules_button");
let play_popup_button = document.getElementById("start_game");
let reset_button = document.getElementById("reset_game");
let rules_span = document.getElementsByClassName("rules close")[0];
let play_span = document.getElementsByClassName("play close")[0];

let play_button = document.getElementById("play");

play_button.onclick = function() {
  document.getElementById("start_game").style.pointerEvents = 'none';
  initGame();
  document.getElementById("reset_game").style.pointerEvents = 'auto';
}

reset_button.onclick = function() {
  resetBoard();
}

rules_popup_button.onclick = function() {
  play_popup.style.display = "none";
  rules_popup.style.display = "block";
}

play_popup_button.onclick = function() {
  rules_popup.style.display = "none";
  play_popup.style.display = "block";
  cleanBoard(document.getElementById("game_container"));
}

rules_span.onclick = function() {
  rules_popup.style.display = "none";
}

play_span.onclick = function() {
  play_popup.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == rules_popup) {
    rules_popup.style.display = "none";
  }
  else if(event.target == play_popup){
    play_popup.style.display = "none";
  }
}