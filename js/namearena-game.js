"use strict";

/*
  GET - NAME ARENA GAME
*/

let allPokemon = [];

let currentPokemon = null;
let currentAnswer = "";
let speechRate = 0.9;
let playerHp = 3;
let timeLimit = 18;
let currentTime = timeLimit;
let timerId = null;
let comboCount = 0;
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
updateHpDisplay();
showSheepMessage("Ready!");
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

  comboCount++;

  button.classList.add("correct");

  checkComboEvent();

}else{

  comboCount = 0;

  button.classList.add("wrong");

  damagePlayer();

}

    }
  });

  const isComboCutin =
  selected === currentAnswer &&
  [5, 10, 15, 20].includes(comboCount);

const waitTime =
  isComboCutin ? 1200 : 550;

setTimeout(() => {

  if(playerHp > 0){

  if(isComboCutin){

    setTimeout(() => {
      generateQuestion();
    }, 700);

  }else{

    setTimeout(() => {
      generateQuestion();
    }, 550);

  }

}
/* ----------------------------
   タイマー
---------------------------- */

function startTimer(){

  const timerCount =
    document.getElementById("timerCount");

  const timerFill =
    document.getElementById("timerFill");
timerFill.classList.remove("danger");
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
if(currentTime <= 5){

  timerFill.classList.add("danger");

}else{

  timerFill.classList.remove("danger");

}
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

  comboCount = 0;

  damagePlayer();

  const questionText =
    document.getElementById("questionText");

  if(questionText){
    questionText.textContent = "TIME UP!";
  }

  setTimeout(() => {

    if(playerHp > 0){
      generateQuestion();
    }

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
/* ----------------------------
   音声読み上げ
---------------------------- */

function setupSpeakButton(){

  const button =
    document.getElementById("soundButton");

  if(!button){
    return;
  }

  button.onclick = () => {

    if(!currentAnswer){
      return;
    }

    speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(currentAnswer);

    speech.lang = "en-US";
    speech.rate = speechRate;

    speechSynthesis.speak(speech);

  };

}
function checkComboEvent(){

  if(comboCount === 5){
    showComboCutin("../assets/images/combo5.PNG");
  }

  if(comboCount === 10){
    showComboCutin("../assets/images/combo10.PNG");
  }

  if(comboCount === 15){
    showComboCutin("../assets/images/combo15.PNG");
  }

  if(comboCount === 20){
    showComboCutin("../assets/images/perfect.PNG");
  }

}

function showComboCutin(imagePath){

  const cutin =
    document.getElementById("comboCutin");

  const image =
    document.getElementById("comboImage");

  image.src = imagePath;
const shakiinSound = new Audio("../assets/sounds/shakiin.mp3");
shakiinSound.currentTime = 0;
shakiinSound.play();
  cutin.classList.remove("hidden");

  let cutinTime = 1100;

if(comboCount === 15){
  cutinTime = 1800;
}

if(comboCount === 20){
  cutinTime = 2600;
}

setTimeout(() => {
  cutin.classList.add("hidden");
}, cutinTime);

}
function updateHpDisplay(){

  const hpBox = document.getElementById("hpBox");

  if(!hpBox){
    return;
  }

  hpBox.textContent = "❤️ ".repeat(playerHp).trim();

}

function showSheepMessage(message){

  const sheepMessage = document.getElementById("sheepMessage");

  if(!sheepMessage){
    return;
  }

  sheepMessage.textContent = message;

}

function damagePlayer(){

  playerHp--;

  if(playerHp < 0){
    playerHp = 0;
  }

  updateHpDisplay();
  showSheepMessage("メェ〜…");

  if(playerHp <= 0){
    showGameOver();
  }

}

function showGameOver(){

  stopTimer();

  const questionText = document.getElementById("questionText");
  const buttons = document.querySelectorAll(".answer-button");

  if(questionText){
    questionText.textContent = "GAME OVER";
  }

  buttons.forEach(button => {
    button.disabled = true;
    button.classList.add("disabled");
  });

  showSheepMessage("もう一回いく？");

}
