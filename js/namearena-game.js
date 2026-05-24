"use strict";

/*
  GET - NAME ARENA GAME
*/

let timeLimit = 18;
let currentTime = timeLimit;
let timerId = null;

document.addEventListener("DOMContentLoaded", () => {
  startTimer();
});

function startTimer(){
  const timerCount = document.getElementById("timerCount");
  const timerFill = document.getElementById("timerFill");

  if(!timerCount || !timerFill){
    return;
  }

  currentTime = timeLimit;

  timerCount.textContent = currentTime;
  timerFill.style.width = "100%";

  timerId = setInterval(() => {
    currentTime--;

    timerCount.textContent = currentTime;

    const percent = (currentTime / timeLimit) * 100;
    timerFill.style.width = percent + "%";

    if(currentTime <= 0){

  clearInterval(timerId);
  timerId = null;

  timerCount.textContent = "0";
  timerFill.style.width = "0%";

  showTimeUp();

}

  }, 1000);
}
function showTimeUp(){

  const buttons = document.querySelectorAll(".answer-button");

  buttons.forEach(button => {
    button.disabled = true;
    button.classList.add("disabled");
  });

  const questionText = document.getElementById("questionText");

  if(questionText){
    questionText.textContent = "TIME UP!";
  }

}