"use strict";

/*
  GET - NAME ARENA GAME
*/

let allPokemon = [];

let currentPokemon = null;
let currentAnswer = "";
let speechRate = 0.9;

let timeLimit = 18;
let currentTime = timeLimit;
let timerId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadPokemonData();
});

/* ----------------------------
   Pokémon読み込み
---------------------------- */

async function loadPokemonData(){

  try{

    const genFiles = [
      "../data/gen1.json",
      "../data/gen2.json",
      "../data/gen3.json",
      "../data/gen4.json",
      "../data/gen5.json",
      "../data/gen6.json",
      "../data/gen7.json",
      "../data/gen8.json",
      "../data/gen9.json"
    ];

    const results = await Promise.all(
      genFiles.map(async file => {

        const response = await fetch(file);

        if(!response.ok){
          throw new Error(file + " 読み込み失敗");
        }

        return await response.json();

      })
    );

    allPokemon = results.flat();

    generateQuestion();

  }catch(error){

    console.error(error);

  }

}

/* ----------------------------
   問題生成
---------------------------- */

function generateQuestion(){

  stopTimer();

  const randomIndex =
    Math.floor(Math.random() * allPokemon.length);

  currentPokemon = allPokemon[randomIndex];

  currentAnswer = currentPokemon.en;

  const questionText =
    document.getElementById("questionText");

  if(questionText){
    questionText.textContent =
      currentPokemon.jp;
  }

  generateChoices();

  enableButtons();

  setupSpeakButton();

  startTimer();

}

/* ----------------------------
   4択生成
---------------------------- */

function generateChoices(){

  const buttons =
    document.querySelectorAll(".answer-button");

  let choices = [currentAnswer];

  while(choices.length < 4){

    const randomPokemon =
      allPokemon[
        Math.floor(Math.random() * allPokemon.length)
      ];

    const randomName =
      randomPokemon.en;

    if(!choices.includes(randomName)){
      choices.push(randomName);
    }

  }

  choices = shuffleArray(choices);

  buttons.forEach((button, index) => {

    button.textContent = choices[index];

    button.onclick = () => {
      checkAnswer(choices[index]);
    };

  });

}

/* ----------------------------
   回答チェック
---------------------------- */

function checkAnswer(selected){

  stopTimer();

  const buttons = document.querySelectorAll(".answer-button");

  buttons.forEach(button => {
    button.disabled = true;

    if(button.textContent.trim() === currentAnswer){
      button.classList.add("correct");
    }
  });

  buttons.forEach(button => {
    if(button.textContent.trim() === selected){

      if(selected === currentAnswer){
        button.classList.add("correct");
      }else{
        button.classList.add("wrong");
      }

    }
  });

  setTimeout(() => {
    generateQuestion();
  }, 900);

}

/* ----------------------------
   タイマー
---------------------------- */

function startTimer(){

  const timerCount =
    document.getElementById("timerCount");

  const timerFill =
    document.getElementById("timerFill");

  currentTime = timeLimit;

  timerCount.textContent = currentTime;
  timerFill.style.width = "100%";

  timerId = setInterval(() => {

    currentTime--;

    timerCount.textContent = currentTime;

    const percent =
      (currentTime / timeLimit) * 100;

    timerFill.style.width =
      percent + "%";

    if(currentTime <= 0){

      stopTimer();

      timerCount.textContent = "0";
      timerFill.style.width = "0%";

      showTimeUp();

    }

  }, 1000);

}

function stopTimer(){

  clearInterval(timerId);
  timerId = null;

}

/* ----------------------------
   TIME UP
---------------------------- */

function showTimeUp(){

  const buttons =
    document.querySelectorAll(".answer-button");

  buttons.forEach(button => {
    button.disabled = true;
    button.classList.add("disabled");
  });

  const questionText =
    document.getElementById("questionText");

  if(questionText){
    questionText.textContent = "TIME UP!";
  }

  setTimeout(() => {
    generateQuestion();
  }, 1200);

}

/* ----------------------------
   ボタン有効化
---------------------------- */

function enableButtons(){

  const buttons =
    document.querySelectorAll(".answer-button");

  buttons.forEach(button => {

    button.disabled = false;

    button.classList.remove("disabled");
    button.classList.remove("correct");
    button.classList.remove("wrong");

  });

}
/* ----------------------------
   シャッフル
---------------------------- */

function shuffleArray(array){

  for(let i = array.length - 1; i > 0; i--){

    const j =
      Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];

  }

  return array;

}