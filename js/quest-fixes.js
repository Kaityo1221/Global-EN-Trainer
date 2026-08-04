"use strict";

setupQuestBgm = function(){
  const bgm = document.getElementById("enquestBgm");
  const button = document.getElementById("bgmStartButton");

  if(!bgm || !button){
    return;
  }

  const settings = typeof getAppSettings === "function"
    ? getAppSettings()
    : {bgmEnabled:true, bgmVolume:0.35};

  bgm.volume = Number(settings.bgmVolume);

  if(!settings.bgmEnabled){
    button.style.display = "none";
    return;
  }

  button.onclick = async () => {
    try{
      bgm.volume = Number(getAppSettings().bgmVolume);
      await bgm.play();
      button.style.display = "none";
    }catch(error){
      console.error(error);
      alert("音声を再生できませんでした");
    }
  };
};

deactivateJunpokoMode = function(){
  localStorage.setItem("junpokoModeActive", "false");
  document.body.classList.remove("junpoko-mode-active");
};

window.addEventListener("getsettingschange", event => {
  const bgm = document.getElementById("enquestBgm");
  const button = document.getElementById("bgmStartButton");
  const settings = event.detail;

  if(bgm){
    bgm.volume = Number(settings.bgmVolume);

    if(!settings.bgmEnabled){
      bgm.pause();
    }
  }

  if(button){
    button.style.display = settings.bgmEnabled ? "" : "none";
  }
});
