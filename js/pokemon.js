"use strict";

/*
  GET - Global EN Trainer
  Pokémon Name Bank Script
*/

let allPokemonData = [];

document.addEventListener("DOMContentLoaded", () => {
  loadPokemonData();
});

async function loadPokemonData(){
  const list = document.getElementById("pokemonList");
  const search = document.getElementById("pokemonSearch");

  if(!list){
    return;
  }

  list.innerHTML = "読み込み中...";

  try{
    const response = await fetch("../data/pokemon.json");

    if(!response.ok){
      throw new Error("pokemon.json の読み込み失敗: " + response.status);
    }

    allPokemonData = await response.json();

    renderPokemonList(allPokemonData);

    const searchButton = document.getElementById("searchButton");

if(searchButton){
  searchButton.addEventListener("click", () => {

    const keyword = search.value.trim().toLowerCase();

    const filtered = allPokemonData.filter(pokemon => {
      return (
        pokemon.no.includes(keyword) ||
        pokemon.en.toLowerCase().includes(keyword) ||
        (pokemon.jp && pokemon.jp.includes(keyword))
      );
    });

    renderPokemonList(filtered);

  });
}
const searchButton = document.getElementById("searchButton");

if(searchButton){
  searchButton.addEventListener("click", () => {
    search.dispatchEvent(new Event("input"));
  });
}
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

function renderPokemonList(data){
  const list = document.getElementById("pokemonList");

  list.innerHTML = "";

  if(data.length === 0){
    list.innerHTML = `
      <div class="pokemon-card">
        <div class="pokemon-en">No results</div>
        <div class="pokemon-jp">該当するポケモンが見つかりません</div>
      </div>
    `;
    return;
  }

  data.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    card.innerHTML = `
      <div class="pokemon-no">No.${pokemon.no}</div>
      <div class="pokemon-en">${pokemon.en}</div>
      <div class="pokemon-jp">${pokemon.jp || "Japanese name pending"}</div>
    `;

    list.appendChild(card);
  });
}
