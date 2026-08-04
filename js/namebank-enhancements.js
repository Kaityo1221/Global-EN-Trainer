"use strict";

let activeGeneration = "all";
let activeType = "all";

const originalRenderPokemonList = renderPokemonList;

renderPokemonList = function(data){
  originalRenderPokemonList(data);

  document.querySelectorAll(".pokemon-card").forEach((card, index) => {
    const pokemon = data[index];

    if(!pokemon){
      return;
    }

    const mainType = (pokemon.types || ["ノーマル"])[0];
    card.classList.add("card-type-" + getTypeClass(mainType));
  });

  const count = document.getElementById("resultCount");

  if(count){
    count.textContent = data.length + "匹";
  }
};

function renderCombinedFilter(){
  const search = document.getElementById("pokemonSearch");
  const keyword = search ? search.value.trim() : "";

  let filtered = filterPokemonByKeyword(keyword);

  if(activeGeneration !== "all"){
    filtered = filtered.filter(pokemon =>
      String(pokemon.gen) === activeGeneration
    );
  }

  if(activeType !== "all"){
    filtered = filtered.filter(pokemon =>
      Array.isArray(pokemon.types) && pokemon.types.includes(activeType)
    );
  }

  renderPokemonList(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  const settings = typeof getAppSettings === "function"
    ? getAppSettings()
    : null;

  if(settings){
    speechRate = Number(settings.speechRate);
  }

  const typeFilter = document.getElementById("typeFilter");
  const search = document.getElementById("pokemonSearch");
  const searchButton = document.getElementById("searchButton");

  document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", event => {
      event.stopImmediatePropagation();

      document.querySelectorAll(".filter-button")
        .forEach(item => item.classList.remove("active"));

      button.classList.add("active");
      activeGeneration = button.dataset.gen || "all";
      renderCombinedFilter();
    }, true);
  });

  if(typeFilter){
    typeFilter.addEventListener("change", () => {
      activeType = typeFilter.value;
      renderCombinedFilter();
    });
  }

  if(searchButton){
    searchButton.addEventListener("click", event => {
      event.stopImmediatePropagation();
      renderCombinedFilter();
    }, true);
  }

  if(search){
    search.addEventListener("keydown", event => {
      if(event.key === "Enter"){
        event.stopImmediatePropagation();
        renderCombinedFilter();
      }
    }, true);
  }
});

window.addEventListener("getsettingschange", event => {
  speechRate = Number(event.detail.speechRate);
});
