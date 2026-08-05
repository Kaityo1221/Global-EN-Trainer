"use strict";

window.loadQuizData = async function(){
  try{
    if(!window.GETPokemonData){
      throw new Error("共通ポケモンデータを読み込めませんでした");
    }

    allQuizPokemon = await window.GETPokemonData.loadAll();
    generateQuiz();
  }catch(error){
    console.error(error);
    const question = document.getElementById("quizQuestion");
    if(question) question.textContent = "読み込みエラー";
  }
};
