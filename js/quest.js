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