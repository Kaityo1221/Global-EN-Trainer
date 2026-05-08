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
    return;
  }

  try{
    const response = await fetch("../data/pokemon.json");

    if(!response.ok){
      throw new Error("pokemon.json を読み込めませんでした");
    }

    const pokemonData = await response.json();

    list.innerHTML = "";

    pokemonData.slice(0, 20).forEach(pokemon => {
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

    list.innerHTML = "データを読み込めませんでした。";
  }
}