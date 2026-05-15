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
  const searchButton = document.getElementById("searchButton");

  if(!list){
    return;
  }

  list.innerHTML = "読み込み中...";

  try{
    const genFiles = [
  "../data/gen1.json",
  "../data/gen2.json",
  "../data/gen3.json",
  "../data/gen4.json",
  "../data/gen5.json",
  "../data/gen6.json",
  "../data/gen7.json",
  "../data/gen8.json",
  "../data/gen9.json"
];

const results = await Promise.all(
  genFiles.map(async file => {
    const response = await fetch(file);

    if(!response.ok){
      throw new Error(file + " の読み込み失敗: " + response.status);
    }

    return await response.json();
  })
);

allPokemonData = results.flat();

    renderPokemonList(allPokemonData);
    setupGenFilters();
    if(search && searchButton){
      searchButton.addEventListener("click", () => {
        runSearch();
      });

      search.addEventListener("keydown", (event) => {
        if(event.key === "Enter"){
          runSearch();
        }
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

function runSearch(){
  const search = document.getElementById("pokemonSearch");

  if(!search){
    return;
  }

  const keyword = search.value.trim().toLowerCase();

  if(keyword === ""){
    renderPokemonList(allPokemonData);
    return;
  }

  const filtered = allPokemonData.filter(pokemon => {
    return (
      pokemon.no.includes(keyword) ||
      pokemon.en.toLowerCase().includes(keyword) ||
      (pokemon.jp && pokemon.jp.includes(keyword))
    );
  });

  renderPokemonList(filtered);
}

function renderPokemonList(data){
  const list = document.getElementById("pokemonList");

  if(!list){
    return;
  }

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
  <div class="pokemon-types">${pokemon.types.join(" / ")}</div>
`;
    list.appendChild(card);
  });
}
function setupGenFilters(){
  const buttons = document.querySelectorAll(".filter-button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const gen = button.dataset.gen;

      if(gen === "all"){
        renderPokemonList(allPokemonData);
        return;
      }

      const filtered = allPokemonData.filter(pokemon => {
        return String(pokemon.gen) === gen;
      });

      renderPokemonList(filtered);
    });
  });
}
