"use strict";

/*
  GET - Global EN Trainer
  Quest Script
  英会話クエスト用
*/

document.addEventListener("DOMContentLoaded", () => {
  console.log("Quest system ready");
});
document.addEventListener("DOMContentLoaded", () => {

  const bgm =
    document.getElementById("enquestBgm");

  const button =
    document.getElementById("bgmStartButton");

  if(!bgm || !button){
    return;
  }

  bgm.volume = 0.35;

  button.onclick = async () => {

    try{
      await bgm.play();
      button.style.display = "none";
    }catch(error){
      console.error(error);
      alert("音声を再生できませんでした");
    }

  };

});

/*
  JunPoko Mode Secret Mission
*/

const JUNPOKO_STORAGE_KEY = "junpokoModeMission";
const JUNPOKO_UNLOCK_KEY = "junpokoModeUnlocked";
const JUNPOKO_SECRET_ACTIVE_KEY = "junpokoModeActive";

let junpokoPressTimer = null;

const defaultJunpokoMission = {
  nameClear: 0,
  combo10: 0,
  walkClear: 0,
  energyClear: 0,
  daily3: 0,
  longPress: 0
};

document.addEventListener("DOMContentLoaded", () => {
  setupJunpokoSecretMode();
  renderJunpokoMission();
});
let junpokoTapCount = 0;
let junpokoTapResetTimer = null;

function setupJunpokoSecretMode(){
  const junpoko = document.getElementById("junpokoArea");

  if(!junpoko){
    return;
  }

  junpoko.addEventListener("click", event => {
    event.preventDefault();

    junpokoTapCount++;

    clearTimeout(junpokoTapResetTimer);

    junpokoTapResetTimer = setTimeout(() => {
      junpokoTapCount = 0;
    }, 1600);

    if(junpokoTapCount >= 7){
      junpokoTapCount = 0;
      handleJunpokoLongPress();
    }
  });
}
function startJunpokoLongPress(){
  cancelJunpokoLongPress();

  junpokoPressTimer = setTimeout(() => {
    handleJunpokoLongPress();
  }, 3000);
}

function cancelJunpokoLongPress(){
  if(junpokoPressTimer){
    clearTimeout(junpokoPressTimer);
    junpokoPressTimer = null;
  }
}

function handleJunpokoLongPress(){

  document.body.classList.add("junpoko-shake");

  setTimeout(() => {
    document.body.classList.remove("junpoko-shake");
  }, 450);

  if(navigator.vibrate){
    navigator.vibrate([120, 80, 120]);
  }

  const unlocked = localStorage.getItem(JUNPOKO_UNLOCK_KEY) === "true";

  if(unlocked){
    toggleJunpokoMode();
    return;
  }

  addJunpokoMissionProgress("longPress", 1);
  showJunpokoAwakeSequence();
}

function getJunpokoMission(){
  const saved = localStorage.getItem(JUNPOKO_STORAGE_KEY);

  if(!saved){
    return {...defaultJunpokoMission};
  }

  try{
    return {
      ...defaultJunpokoMission,
      ...JSON.parse(saved)
    };
  }catch(error){
    return {...defaultJunpokoMission};
  }
}

function saveJunpokoMission(data){
  localStorage.setItem(JUNPOKO_STORAGE_KEY, JSON.stringify(data));
}

function addJunpokoMissionProgress(key, amount){
  const mission = getJunpokoMission();

  const limits = {
    nameClear: 1,
    combo10: 10,
    walkClear: 1,
    energyClear: 1,
    daily3: 3,
    longPress: 1
  };

  mission[key] = Math.min((mission[key] || 0) + amount, limits[key]);

  saveJunpokoMission(mission);
  renderJunpokoMission();
  checkJunpokoMissionComplete();
}

function renderJunpokoMission(){
  const bar = document.getElementById("junpokoMissionBar");

  if(!bar){
    return;
  }

  const mission = getJunpokoMission();
  const unlocked = localStorage.getItem(JUNPOKO_UNLOCK_KEY) === "true";

  const hasStarted =
    mission.nameClear > 0 ||
    mission.combo10 > 0 ||
    mission.walkClear > 0 ||
    mission.energyClear > 0 ||
    mission.daily3 > 0 ||
    mission.longPress > 0 ||
    unlocked;

  if(hasStarted){
    bar.classList.add("is-show");
  }

  setMissionText("missionNameClear", mission.nameClear, 1);
  setMissionText("missionCombo10", mission.combo10, 10);
  setMissionText("missionWalkClear", mission.walkClear, 1);
  setMissionText("missionEnergyClear", mission.energyClear, 1);
  setMissionText("missionDaily3", mission.daily3, 3);
  setMissionText("missionLongPress", mission.longPress, 1);

  updateMissionCardState("nameClear", mission.nameClear >= 1);
  updateMissionCardState("combo10", mission.combo10 >= 10);
  updateMissionCardState("walkClear", mission.walkClear >= 1);
  updateMissionCardState("energyClear", mission.energyClear >= 1);
  updateMissionCardState("daily3", mission.daily3 >= 3);
  updateMissionCardState("longPress", mission.longPress >= 1);
}

function setMissionText(id, value, max){
  const element = document.getElementById(id);

  if(!element){
    return;
  }

  element.textContent = value + "/" + max;
}

function updateMissionCardState(key, complete){
  const card = document.querySelector('.junpoko-mission-card[data-mission="' + key + '"]');

  if(!card){
    return;
  }

  card.classList.toggle("is-complete", complete);
}

function checkJunpokoMissionComplete(){
  const mission = getJunpokoMission();

  const complete =
    mission.nameClear >= 1 &&
    mission.combo10 >= 10 &&
    mission.walkClear >= 1 &&
    mission.energyClear >= 1 &&
    mission.daily3 >= 3 &&
    mission.longPress >= 1;

  if(!complete){
    return;
  }

  if(localStorage.getItem(JUNPOKO_UNLOCK_KEY) === "true"){
    return;
  }

  localStorage.setItem(JUNPOKO_UNLOCK_KEY, "true");

  showJunpokoFinalUnlockSequence();
}

function showJunpokoAwakeSequence(){
  const overlay = document.getElementById("junpokoAwakeOverlay");
  const text = document.getElementById("junpokoAwakeText");

  if(!overlay || !text){
    return;
  }

  overlay.classList.add("is-show");

  text.textContent = "六つの試練を越えよ。";

  setTimeout(() => {
    text.textContent = "JunPoko Mode は、まだ封印されている。";
  }, 1800);

  setTimeout(() => {
    overlay.classList.remove("is-show");
    renderJunpokoMission();
  }, 3900);
}

function showJunpokoFinalUnlockSequence(){
  const overlay = document.getElementById("junpokoAwakeOverlay");
  const text = document.getElementById("junpokoAwakeText");

  if(!overlay || !text){
    return;
  }

  overlay.classList.add("is-show");

  text.textContent = "封印は解かれた。";

  setTimeout(() => {
    text.textContent = "JunPoko Mode 覚醒";
  }, 1800);

  setTimeout(() => {
    overlay.classList.remove("is-show");
    activateJunpokoMode();
    renderJunpokoMission();
  }, 3800);
}

function toggleJunpokoMode(){
  const active = localStorage.getItem(JUNPOKO_SECRET_ACTIVE_KEY) === "true";

  if(active){
    deactivateJunpokoMode();
  }else{
    activateJunpokoMode();
  }
}

function activateJunpokoMode(){
  localStorage.setItem(JUNPOKO_SECRET_ACTIVE_KEY, "true");
  document.body.classList.add("junpoko-mode-active");
}

function deactivateJunpokoMode(){
  localStorage.setItem(JUNPOKO_SECRET_ACTIVE_KEY, "false");
  document.body.classList.remove("junpoko-mode-active");
}

window.resetJunpokoMission = function(){

  localStorage.removeItem("junpokoModeMission");
  localStorage.removeItem("junpokoModeUnlocked");
  localStorage.removeItem("junpokoModeActive");

  location.reload();
};