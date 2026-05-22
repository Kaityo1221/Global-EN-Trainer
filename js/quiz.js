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

  clearQuizEffects();

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

  showBigJudge(true);

  try{
    playCorrectTypeEffect(currentQuizPokemon.types || []);
  }catch(error){
    console.error("タイプ演出エラー:", error);
  }
}
  else{
  result.textContent = "❌ Wrong... 正解: " + currentAnswer;

  showBigJudge(false);
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
function clearQuizEffects(){

  document
    .querySelectorAll(
      ".normal-effect, .fire-effect, .grass-effect, .steel-effect, .water-effect, .electric-flash, .ghost-effect, .dragon-aura, .ice-effect, .dark-effect, .fairy-effect, .psychic-ring, .fighting-impact, .poison-effect, .ground-effect, .flying-effect, .bug-effect, .rock-effect"
    )
    .forEach(effect => {
      effect.remove();
    });

}
function showBigJudge(isCorrect){

  const oldJudge =
    document.querySelector(".big-judge");

  if(oldJudge){
    oldJudge.remove();
  }

  const judge = document.createElement("div");

  judge.className =
    isCorrect ? "big-judge correct" : "big-judge wrong";

  judge.textContent =
    isCorrect ? "⭕" : "❌";

  document.body.appendChild(judge);

  setTimeout(() => {
    judge.remove();
  }, 600);

}
function playCorrectTypeEffect(types = []){

  const card = document.querySelector(".quiz-card");

  if(!card){
    return;
  }

  if(!Array.isArray(types) || types.length === 0){
    types = ["ノーマル"];
  }

  /* =========================
     NORMAL
  ========================= */

  if(types.includes("ノーマル")){

    const normal = document.createElement("div");

    normal.className = "normal-effect";

    card.appendChild(normal);

    setTimeout(() => {
      normal.remove();
    }, 500);
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
    }, 800);
  }

  /* =========================
     WATER
  ========================= */

  if(types.includes("みず")){

    const wrap = document.createElement("div");

    wrap.className = "water-effect";

    for(let i = 0; i < 12; i++){

      const drop = document.createElement("div");

      drop.className = "water-drop";

      drop.style.left =
        Math.random() * 100 + "%";

      drop.style.animationDelay =
        Math.random() * 0.18 + "s";

      wrap.appendChild(drop);
    }

    card.appendChild(wrap);

    setTimeout(() => {
      wrap.remove();
    }, 900);
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
     GRASS
  ========================= */

  if(types.includes("くさ")){

    const grass = document.createElement("div");

    grass.className = "grass-effect";

    card.appendChild(grass);

    setTimeout(() => {
      grass.remove();
    }, 800);
  }

  /* =========================
     ICE
  ========================= */

  if(types.includes("こおり")){

    const ice = document.createElement("div");

    ice.className = "ice-effect";

    card.appendChild(ice);

    setTimeout(() => {
      ice.remove();
    }, 800);
  }

  /* =========================
     FIGHTING
  ========================= */

  if(types.includes("かくとう")){

    const impact = document.createElement("div");

    impact.className = "fighting-impact";

    card.appendChild(impact);

    setTimeout(() => {
      impact.remove();
    }, 600);
  }

  /* =========================
     POISON
  ========================= */

  if(types.includes("どく")){

    const poison = document.createElement("div");

    poison.className = "poison-effect";

    for(let i = 0; i < 8; i++){

      const bubble = document.createElement("div");

      bubble.className = "poison-bubble";

      bubble.style.left =
        Math.random() * 100 + "%";

      bubble.style.animationDelay =
        Math.random() * 0.2 + "s";

      poison.appendChild(bubble);
    }

    card.appendChild(poison);

    setTimeout(() => {
      poison.remove();
    }, 900);
  }

  /* =========================
     GROUND
  ========================= */

  if(types.includes("じめん")){

    const ground = document.createElement("div");

    ground.className = "ground-effect";

    card.appendChild(ground);

    setTimeout(() => {
      ground.remove();
    }, 600);
  }

  /* =========================
     FLYING
  ========================= */

  if(types.includes("ひこう")){

    const flying = document.createElement("div");

    flying.className = "flying-effect";

    for(let i = 0; i < 5; i++){

      const line = document.createElement("div");

      line.className = "wind-line";

      line.style.top =
        (20 + Math.random() * 60) + "%";

      line.style.animationDelay =
        Math.random() * 0.18 + "s";

      flying.appendChild(line);
    }

    card.appendChild(flying);

    setTimeout(() => {
      flying.remove();
    }, 750);
  }

  /* =========================
     PSYCHIC
  ========================= */

  if(types.includes("エスパー")){

    const ring = document.createElement("div");

    ring.className = "psychic-ring";

    card.appendChild(ring);

    setTimeout(() => {
      ring.remove();
    }, 800);
  }

  /* =========================
     BUG
  ========================= */

  if(types.includes("むし")){

    const bug = document.createElement("div");

    bug.className = "bug-effect";

    for(let i = 0; i < 12; i++){

      const dot = document.createElement("div");

      dot.className = "bug-dot";

      dot.style.left =
        Math.random() * 100 + "%";

      dot.style.top =
        (50 + Math.random() * 35) + "%";

      dot.style.animationDelay =
        Math.random() * 0.18 + "s";

      bug.appendChild(dot);
    }

    card.appendChild(bug);

    setTimeout(() => {
      bug.remove();
    }, 800);
  }

  /* =========================
     ROCK
  ========================= */

  if(types.includes("いわ")){

    const rock = document.createElement("div");

    rock.className = "rock-effect";

    for(let i = 0; i < 8; i++){

      const piece = document.createElement("div");

      piece.className = "rock-piece";

      piece.style.setProperty(
        "--x",
        (Math.random() * 180 - 90) + "px"
      );

      piece.style.setProperty(
        "--y",
        (Math.random() * 160 - 80) + "px"
      );

      piece.style.animationDelay =
        Math.random() * 0.1 + "s";

      rock.appendChild(piece);
    }

    card.appendChild(rock);

    setTimeout(() => {
      rock.remove();
    }, 800);
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
    }, 900);
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
    }, 800);
  }

  /* =========================
     DARK
  ========================= */

  if(types.includes("あく")){

    const dark = document.createElement("div");

    dark.className = "dark-effect";

    card.appendChild(dark);

    setTimeout(() => {
      dark.remove();
    }, 700);
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
    }, 600);
  }

  /* =========================
     FAIRY
  ========================= */

  if(types.includes("フェアリー")){

    const fairy = document.createElement("div");

    fairy.className = "fairy-effect";

    for(let i = 0; i < 10; i++){

      const star = document.createElement("div");

      star.className = "fairy-star";

      star.textContent = "✦";

      star.style.left =
        Math.random() * 100 + "%";

      star.style.top =
        (60 + Math.random() * 30) + "%";

      star.style.animationDelay =
        Math.random() * 0.2 + "s";

      fairy.appendChild(star);
    }

    card.appendChild(fairy);

    setTimeout(() => {
      fairy.remove();
    }, 900);
  }

}