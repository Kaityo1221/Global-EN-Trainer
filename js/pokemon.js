"use strict";

let allPokemonData = [];
let activeGeneration = "all";
let activeType = "all";
let speechRate = 0.9;

const TYPE_CLASS_MAP = {
  "ノーマル":"normal","ほのお":"fire","みず":"water","でんき":"electric",
  "くさ":"grass","こおり":"ice","かくとう":"fighting","どく":"poison",
  "じめん":"ground","ひこう":"flying","エスパー":"psychic","むし":"bug",
  "いわ":"rock","ゴースト":"ghost","ドラゴン":"dragon","あく":"dark",
  "はがね":"steel","フェアリー":"fairy"
};

function getTypeClass(type){
  return TYPE_CLASS_MAP[type] || "normal";
}

function getSearchKeyword(){
  const search = document.getElementById("pokemonSearch");
  return search ? search.value.trim() : "";
}

function filterPokemon(){
  const keyword = getSearchKeyword();
  const normalized = keyword.toLowerCase();

  return allPokemonData.filter(pokemon => {
    const matchesKeyword = !keyword || (
      String(pokemon.no).includes(normalized) ||
      String(pokemon.en || "").toLowerCase().includes(normalized) ||
      String(pokemon.jp || "").includes(keyword)
    );

    const matchesGeneration = activeGeneration === "all" ||
      String(pokemon.gen) === activeGeneration;

    const matchesType = activeType === "all" ||
      (Array.isArray(pokemon.types) && pokemon.types.includes(activeType));

    return matchesKeyword && matchesGeneration && matchesType;
  });
}

function renderPokemonList(data){
  const list = document.getElementById("pokemonList");
  const count = document.getElementById("resultCount");

  if(!list) return;
  if(count) count.textContent = data.length + "匹";

  if(data.length === 0){
    list.innerHTML = `
      <div class="pokemon-card">
        <div class="pokemon-en">No results</div>
        <div class="pokemon-jp">該当するポケモンが見つかりません</div>
      </div>
    `;
    return;
  }

  list.innerHTML = data.map(pokemon => {
    const types = Array.isArray(pokemon.types) ? pokemon.types : [];
    const mainType = types[0] || "ノーマル";
    const safeEnglishName = String(pokemon.en || "").replace(/'/g,"&#39;");

    return `
      <article class="pokemon-card card-type-${getTypeClass(mainType)}">
        <div class="pokemon-no">No.${String(pokemon.no).padStart(3,"0")}</div>
        <div class="pokemon-name-row">
          <div class="pokemon-en">${pokemon.en}</div>
          <button class="speak-button" type="button" data-speak="${safeEnglishName}" aria-label="${pokemon.en}を読み上げる">
            <img src="../assets/images/speaker.png" alt="" class="speaker-icon">
          </button>
        </div>
        <div class="pokemon-jp">${pokemon.jp || "Japanese name pending"}</div>
        <div class="pokemon-types">
          ${types.map(type => `<span class="type-badge type-${getTypeClass(type)}">${type}</span>`).join("")}
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll("[data-speak]").forEach(button => {
    button.addEventListener("click", () => speakPokemon(button.dataset.speak));
  });
}

function renderFilteredPokemon(){
  renderPokemonList(filterPokemon());
}

function setupFilters(){
  document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button")
        .forEach(item => item.classList.remove("active"));

      button.classList.add("active");
      activeGeneration = button.dataset.gen || "all";
      renderFilteredPokemon();
    });
  });

  const typeFilter = document.getElementById("typeFilter");
  if(typeFilter){
    typeFilter.addEventListener("change", () => {
      activeType = typeFilter.value;
      renderFilteredPokemon();
    });
  }

  const search = document.getElementById("pokemonSearch");
  const searchButton = document.getElementById("searchButton");

  if(searchButton) searchButton.addEventListener("click",renderFilteredPokemon);
  if(search){
    search.addEventListener("input",renderFilteredPokemon);
    search.addEventListener("keydown",event => {
      if(event.key === "Enter") renderFilteredPokemon();
    });
  }
}

async function initializeNameBank(){
  const list = document.getElementById("pokemonList");
  if(!list) return;

  list.textContent = "読み込み中...";

  try{
    if(!window.GETPokemonData){
      throw new Error("共通ポケモンデータを読み込めませんでした");
    }

    allPokemonData = await window.GETPokemonData.loadAll();

    const settings = typeof getAppSettings === "function"
      ? getAppSettings()
      : null;

    if(settings) speechRate = Number(settings.speechRate);

    const params = new URLSearchParams(window.location.search);
    const searchKeyword = params.get("search");
    const search = document.getElementById("pokemonSearch");

    if(searchKeyword && search) search.value = searchKeyword;

    setupFilters();
    renderFilteredPokemon();
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

window.speakPokemon = function(name){
  if(!("speechSynthesis" in window)) return;

  const speech = new SpeechSynthesisUtterance(name);
  speech.lang = "en-US";
  speech.rate = speechRate;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
};

window.changeSpeechRate = function(){
  const rates = [0.7,0.9,1.15];
  const labels = ["ゆっくり","通常","速め"];
  const currentIndex = rates.indexOf(speechRate);
  const nextIndex = (currentIndex + 1) % rates.length;

  speechRate = rates[nextIndex];

  const button = document.getElementById("sideRateButton");
  if(button) button.textContent = "速さ：" + labels[nextIndex];

  if(typeof getAppSettings === "function" && typeof saveAppSettings === "function"){
    saveAppSettings({...getAppSettings(),speechRate});
  }
};

window.scrollToTop = function(){
  window.scrollTo({top:0,behavior:"smooth"});
};

window.addEventListener("getsettingschange",event => {
  speechRate = Number(event.detail.speechRate);
});

document.addEventListener("DOMContentLoaded",initializeNameBank);
