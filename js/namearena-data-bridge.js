"use strict";

window.loadPokemonData = async function(){
  try{
    if(!window.GETPokemonData){
      throw new Error("共通ポケモンデータを読み込めませんでした");
    }

    allPokemon = await window.GETPokemonData.loadAll();

    if(typeof getAppSettings === "function"){
      speechRate = Number(getAppSettings().speechRate);
    }

    generateQuestion();
  }catch(error){
    console.error(error);
    const question = document.getElementById("questionText");
    if(question) question.textContent = "読み込みエラー";
  }
};

window.addEventListener("getsettingschange",event => {
  speechRate = Number(event.detail.speechRate);
});
