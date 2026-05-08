"use strict";

/*
  GET - Global EN Trainer
  Pokémon Name Bank Script
*/

document.addEventListener("DOMContentLoaded", () => {
  loadPokemonData();
});

async function loadPokemonData(){
  const list = document.getElementById("pokemonList");

  if(!list){
    console.log("pokemonList が見つかりません");
    return;
  }

  list.innerHTML = "読み込み中...";

  try{
    const response = await fetch("../data/pokemon.json");

    if(!response.ok){
      throw new Error("pokemon.json の読み込み失敗: " + response.status);
    }

    const pokemonData = await response.json();

    list.innerHTML = "";

    pokemonData.forEach(pokemon => {
      const card = document.createElement("div");
      card.className = "pokemon-card";

      card.innerHTML = `
        <div class="pokemon-no">No.${pokemon.no}</div>
        <div class="pokemon-en">${pokemon.en}</div>
        <div class="pokemon-jp">${pokemon.jp || "Japanese name pending"}</div>
      `;

      list.appendChild(card);
    });

  }catch(error){
    console.error(error);
    list.innerHTML = `
      <div class="pokemon-card">
        <div class="pokemon-en">読み込みエラー</div>
        <div class="pokemon-jp">${error.message}</div>
      </div>
    `;
  }
}