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

  if(!bgm){
    return;
  }

  bgm.volume = 0.35;

  document.body.addEventListener("touchstart", () => {
    bgm.play();
  }, { once:true });

  document.body.addEventListener("click", () => {
    bgm.play();
  }, { once:true });

});