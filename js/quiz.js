"use strict";

/*
  GET - Global EN Trainer
  Daily Quiz Script
*/

let allQuizPokemon = [];
let currentQuizPokemon = null;
let currentAnswer = "";

let quizCount = 1;
let score = 0;

const maxQuiz = 10;

document.addEventListener("DOMContentLoaded", () => {
  loadQuizData();
});

async function loadQuizData(){

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
          throw new Error(file + " の読み込み失敗");
        }

        return await response.json();
      })
    );

    allQuizPokemon = results.flat();

    generateQuiz();

  }catch(error){
    console.error(error);

    document.getElementById("quizQuestion").textContent =
      "読み込みエラー";
  }

}

function generateQuiz(){

  document.getElementById("quizResult").textContent = "";
  document.getElementById("quizNextButton").disabled = true;

  const randomIndex =
    Math.floor(Math.random() * allQuizPokemon.length);

  currentQuizPokemon = allQuizPokemon[randomIndex];
  currentAnswer = currentQuizPokemon.en;

  document.getElementById("quizQuestion").textContent =
    currentQuizPokemon.jp;

  document.getElementById("quizCount").textContent =
    quizCount + " / " + maxQuiz;

  document.getElementById("quizScore").textContent =
    "Score " + score;

  generateOptions();
const card =
  document.getElementById("quizCard");

card.classList.remove("open-down-right-out");

void card.offsetWidth;
card.classList.add("quiz-enter");

setTimeout(() => {
  card.classList.remove("quiz-enter");
}, 300);
}

function generateOptions(){

  const optionsContainer =
    document.getElementById("quizOptions");

  optionsContainer.innerHTML = "";

  let choices = [currentAnswer];

  while(choices.length < 4){
    const randomPokemon =
      allQuizPokemon[
        Math.floor(Math.random() * allQuizPokemon.length)
      ];

    if(!choices.includes(randomPokemon.en)){
      choices.push(randomPokemon.en);
    }
  }

  choices = shuffleArray(choices);

  choices.forEach(choice => {
    const button = document.createElement("button");

    button.className = "quiz-option-button";
    button.textContent = choice;

    button.onclick = () => {
      checkAnswer(choice, button);
    };

    optionsContainer.appendChild(button);
  });

}

function checkAnswer(choice, clickedButton){

  const buttons =
    document.querySelectorAll(".quiz-option-button");

  buttons.forEach(button => {
    button.disabled = true;

    if(button.textContent === currentAnswer){
      button.classList.add("correct");
    }

    if(button === clickedButton && choice !== currentAnswer){
      button.classList.add("wrong");
    }
  });

  const result =
    document.getElementById("quizResult");

  if(choice === currentAnswer){
  score++;

  result.textContent = "⭕ Correct!";

  playCorrectTypeEffect();
}
  else{
    result.textContent = "❌ Wrong... 正解: " + currentAnswer;
  }

  document.getElementById("quizScore").textContent =
    "Score " + score;

  document.getElementById("quizNextButton").disabled = false;

setTimeout(() => {
  nextQuiz();
}, 800);

}
window.nextQuiz = function(){

  quizCount++;

  if(quizCount > maxQuiz){
    showFinalResult();
    return;
  }

  generateQuiz();

}

function showFinalResult(){

  const card =
  document.getElementById("quizCard");

  card.innerHTML = `
    <div class="quiz-finish">
      <h2>Quiz Complete!</h2>

      <div class="final-score">
        ${score} / ${maxQuiz}
      </div>

      <button
        class="quiz-restart-button"
        onclick="location.reload()"
      >
        Play Again
      </button>
    </div>
  `;

}

function shuffleArray(array){
  return array.sort(() => Math.random() - 0.5);
}
function getQuizEffectType(){
  if(
    !currentQuizPokemon ||
    !currentQuizPokemon.types ||
    currentQuizPokemon.types.length === 0
  ){
    return "normal";
  }

  const mainType = currentQuizPokemon.types[0];

  const map = {
    "ほのお":"fire",
    "くさ":"grass",
    "はがね":"steel"
  };

  return map[mainType] || "normal";
}

function playCorrectTypeEffect(types){

  const card = document.querySelector(".quiz-card");

  if(!card){
    return;
  }

  /* =========================
     FIRE
  ========================= */

  if(types.includes("ほのお")){

    const fire = document.createElement("div");

    fire.className = "fire-effect";

    card.appendChild(fire);

    setTimeout(() => {
      fire.remove();
    }, 900);
  }

  /* =========================
     GRASS
  ========================= */

  if(types.includes("くさ")){

    const leaf = document.createElement("div");

    leaf.className = "grass-effect";

    card.appendChild(leaf);

    setTimeout(() => {
      leaf.remove();
    }, 1000);
  }

  /* =========================
     STEEL
  ========================= */

  if(types.includes("はがね")){

    const steel = document.createElement("div");

    steel.className = "steel-effect";

    card.appendChild(steel);

    setTimeout(() => {
      steel.remove();
    }, 700);
  }

  /* =========================
     WATER
  ========================= */

  if(types.includes("みず")){

    const wrap = document.createElement("div");

    wrap.className = "water-effect";

    for(let i = 0; i < 14; i++){

      const drop = document.createElement("div");

      drop.className = "water-drop";

      drop.style.left = Math.random() * 100 + "%";

      drop.style.animationDelay =
        (Math.random() * 0.3) + "s";

      wrap.appendChild(drop);
    }

    card.appendChild(wrap);

    setTimeout(() => {
      wrap.remove();
    }, 1200);
  }

  /* =========================
     ELECTRIC
  ========================= */

  if(types.includes("でんき")){

    const flash = document.createElement("div");

    flash.className = "electric-flash";

    card.appendChild(flash);

    setTimeout(() => {
      flash.remove();
    }, 500);
  }

  /* =========================
     GHOST
  ========================= */

  if(types.includes("ゴースト")){

    const ghost = document.createElement("div");

    ghost.className = "ghost-effect";

    card.appendChild(ghost);

    setTimeout(() => {
      ghost.remove();
    }, 1200);
  }

  /* =========================
     DRAGON
  ========================= */

  if(types.includes("ドラゴン")){

    const aura = document.createElement("div");

    aura.className = "dragon-aura";

    card.appendChild(aura);

    setTimeout(() => {
      aura.remove();
    }, 1000);
  }
}