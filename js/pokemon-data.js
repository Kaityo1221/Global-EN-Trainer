"use strict";

(function(){
  let pokemonPromise = null;

  function getDataBasePath(){
    return window.location.pathname.includes("/pages/")
      ? "../data/"
      : "data/";
  }

  async function loadAll(){
    if(pokemonPromise){
      return pokemonPromise;
    }

    pokemonPromise = Promise.all(
      Array.from({length:9}, (_,index) => {
        const file = getDataBasePath() + "gen" + (index + 1) + ".json";

        return fetch(file).then(response => {
          if(!response.ok){
            throw new Error(file + " の読み込み失敗: " + response.status);
          }

          return response.json();
        });
      })
    ).then(results => results.flat());

    return pokemonPromise;
  }

  async function getAllPokemon(){
    return loadAll();
  }

  function getDateSeed(date = new Date()){
    return (
      date.getFullYear() * 10000 +
      (date.getMonth() + 1) * 100 +
      date.getDate()
    );
  }

  async function getDailyPokemon(date = new Date()){
    const allPokemon = await loadAll();
    const seed = getDateSeed(date);
    const legendaryNos = new Set(["144","145","146","150","151"]);
    const isRare = seed % 20 === 0;

    if(isRare){
      const rarePool = allPokemon.filter(pokemon =>
        legendaryNos.has(String(pokemon.no).padStart(3,"0"))
      );

      if(rarePool.length > 0){
        return {
          pokemon:rarePool[seed % rarePool.length],
          isRare:true
        };
      }
    }

    return {
      pokemon:allPokemon[seed % allPokemon.length],
      isRare:false
    };
  }

  window.GETPokemonData = {
    loadAll,
    getAllPokemon,
    getDailyPokemon,
    getDateSeed
  };
})();
