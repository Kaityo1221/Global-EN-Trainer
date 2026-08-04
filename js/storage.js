"use strict";

function showSettingsStatus(message){
  const status = document.getElementById("settingsStatus");

  if(!status){
    return;
  }

  status.textContent = message;

  window.setTimeout(() => {
    status.textContent = "";
  }, 2200);
}

function loadSettingsForm(){
  if(typeof getAppSettings !== "function"){
    return;
  }

  const settings = getAppSettings();
  const speechRate = document.getElementById("speechRate");
  const bgmEnabled = document.getElementById("bgmEnabled");
  const bgmVolume = document.getElementById("bgmVolume");
  const bgmVolumeLabel = document.getElementById("bgmVolumeLabel");
  const reducedMotion = document.getElementById("reducedMotion");

  if(speechRate){
    speechRate.value = String(settings.speechRate);
  }

  if(bgmEnabled){
    bgmEnabled.checked = Boolean(settings.bgmEnabled);
  }

  if(bgmVolume){
    bgmVolume.value = String(settings.bgmVolume);
  }

  if(bgmVolumeLabel){
    bgmVolumeLabel.textContent = Math.round(settings.bgmVolume * 100) + "%";
  }

  if(reducedMotion){
    reducedMotion.checked = Boolean(settings.reducedMotion);
  }
}

function saveSettingsForm(){
  const current = getAppSettings();
  const speechRate = document.getElementById("speechRate");
  const bgmEnabled = document.getElementById("bgmEnabled");
  const bgmVolume = document.getElementById("bgmVolume");
  const reducedMotion = document.getElementById("reducedMotion");

  saveAppSettings({
    ...current,
    speechRate: speechRate ? Number(speechRate.value) : current.speechRate,
    bgmEnabled: bgmEnabled ? bgmEnabled.checked : current.bgmEnabled,
    bgmVolume: bgmVolume ? Number(bgmVolume.value) : current.bgmVolume,
    reducedMotion: reducedMotion ? reducedMotion.checked : current.reducedMotion
  });

  loadSettingsForm();
  showSettingsStatus("設定を保存しました");
}

document.addEventListener("DOMContentLoaded", () => {
  loadSettingsForm();

  ["speechRate", "bgmEnabled", "bgmVolume", "reducedMotion"]
    .forEach(id => {
      const element = document.getElementById(id);

      if(element){
        element.addEventListener("change", saveSettingsForm);
        element.addEventListener("input", () => {
          if(id === "bgmVolume"){
            const label = document.getElementById("bgmVolumeLabel");

            if(label){
              label.textContent = Math.round(Number(element.value) * 100) + "%";
            }
          }
        });
      }
    });

  const resetSettingsButton = document.getElementById("resetSettingsButton");
  const resetLearningButton = document.getElementById("resetLearningButton");

  if(resetSettingsButton){
    resetSettingsButton.addEventListener("click", () => {
      resetAppSettings();
      loadSettingsForm();
      showSettingsStatus("設定を初期値へ戻しました");
    });
  }

  if(resetLearningButton){
    resetLearningButton.addEventListener("click", () => {
      const ok = window.confirm(
        "クイズやJunPokoなどの進行データをリセットします。よろしいですか？"
      );

      if(!ok){
        return;
      }

      resetLearningData();
      showSettingsStatus("学習データをリセットしました");
    });
  }
});
