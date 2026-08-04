"use strict";

const GET_SETTINGS_KEY = "getAppSettings";

const GET_DEFAULT_SETTINGS = {
  speechRate: 0.9,
  bgmEnabled: true,
  bgmVolume: 0.35,
  reducedMotion: false
};

function getAppSettings(){
  const saved = localStorage.getItem(GET_SETTINGS_KEY);

  if(!saved){
    return {...GET_DEFAULT_SETTINGS};
  }

  try{
    return {
      ...GET_DEFAULT_SETTINGS,
      ...JSON.parse(saved)
    };
  }catch(error){
    console.warn("GET settings could not be read.", error);
    return {...GET_DEFAULT_SETTINGS};
  }
}

function saveAppSettings(settings){
  localStorage.setItem(
    GET_SETTINGS_KEY,
    JSON.stringify({
      ...GET_DEFAULT_SETTINGS,
      ...settings
    })
  );

  applyAppSettings();
}

function applyAppSettings(){
  const settings = getAppSettings();

  document.documentElement.classList.toggle(
    "reduce-motion",
    Boolean(settings.reducedMotion)
  );

  document.querySelectorAll("audio").forEach(audio => {
    audio.volume = Number(settings.bgmVolume);

    if(!settings.bgmEnabled && !audio.paused){
      audio.pause();
    }
  });

  window.GET_APP_SETTINGS = settings;
  window.dispatchEvent(
    new CustomEvent("getsettingschange", {detail: settings})
  );
}

function resetAppSettings(){
  localStorage.removeItem(GET_SETTINGS_KEY);
  applyAppSettings();
}

function resetLearningData(){
  const protectedKeys = new Set([GET_SETTINGS_KEY]);

  Object.keys(localStorage).forEach(key => {
    if(!protectedKeys.has(key)){
      localStorage.removeItem(key);
    }
  });
}

window.getAppSettings = getAppSettings;
window.saveAppSettings = saveAppSettings;
window.applyAppSettings = applyAppSettings;
window.resetAppSettings = resetAppSettings;
window.resetLearningData = resetLearningData;

document.addEventListener("DOMContentLoaded", applyAppSettings);
