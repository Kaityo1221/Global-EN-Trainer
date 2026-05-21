"use strict";

/*
  ====================================
  GET - Global EN Trainer
  Main Script
  ====================================
*/

document.addEventListener("DOMContentLoaded", () => {

  console.log("GET initialized");

});
let currentTodayPokemon = null;
/* =========================
   Common Side Menu
========================= */

window.openMenu = function(){

  const menu = document.getElementById("sideMenu");

  if(menu){
    menu.classList.add("open");
  }

}

window.closeMenu = function(){

  const menu = document.getElementById("sideMenu");

  if(menu){
    menu.classList.remove("open");
  }

}
function getMainType(pokemon){
  if(!pokemon.types || pokemon.types.length === 0){
    return "normal";
  }

  return pokemon.types[0];
}

function getTypeClass(type){
  const map = {
    "ノーマル":"normal",
    "ほのお":"fire",
    "みず":"water",
    "くさ":"grass",
    "でんき":"electric",
    "エスパー":"psychic",
    "こおり":"ice",
    "かくとう":"fighting",
    "どく":"poison",
    "じめん":"ground",
    "ひこう":"flying",
    "むし":"bug",
    "いわ":"rock",
    "ゴースト":"ghost",
    "ドラゴン":"dragon",
    "あく":"dark",
    "はがね":"steel",
    "フェアリー":"fairy"
  };

  return map[type] || "normal";
}

function getTypeLabel(type){
  const map = {
    "ノーマル":"NORMAL",
    "ほのお":"FIRE",
    "みず":"WATER",
    "くさ":"GRASS",
    "でんき":"ELECTRIC",
    "エスパー":"PSYCHIC",
    "こおり":"ICE",
    "かくとう":"FIGHTING",
    "どく":"POISON",
    "じめん":"GROUND",
    "ひこう":"FLYING",
    "むし":"BUG",
    "いわ":"ROCK",
    "ゴースト":"GHOST",
    "ドラゴン":"DRAGON",
    "あく":"DARK",
    "はがね":"STEEL",
    "フェアリー":"FAIRY"
  };

  return map[type] || "NORMAL";
}

function getTypeSymbol(type){
  const map = {
    "ノーマル":"✦",
    "ほのお":"🔥",
    "みず":"💧",
    "くさ":"🍃",
    "でんき":"⚡",
    "エスパー":"✦",
    "こおり":"❄",
    "かくとう":"拳",
    "どく":"☠",
    "じめん":"◆",
    "ひこう":"羽",
    "むし":"✣",
    "いわ":"◇",
    "ゴースト":"👻",
    "ドラゴン":"✦",
    "あく":"☾",
    "はがね":"⬢",
    "フェアリー":"✧"
  };

  return map[type] || "✦";
}

function loadTodayPokemon(){
  if(typeof todayPokemonList === "undefined"){
    return;
  }

  const today = new Date();

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
const legendaryPokemonNos = [
  "144", // Articuno
  "145", // Zapdos
  "146", // Moltres
  "150", // Mewtwo
  "151"  // Mew
];
  let pokemon;

/*
  5%でレア演出
*/
const isRare = (seed % 100) < 5;

if(isRare){

  const legendaryList = todayPokemonList.filter(p =>
    legendaryPokemonNos.includes(p.no)
  );

  pokemon =
    legendaryList[
      seed % legendaryList.length
    ];

}else{

  pokemon =
    todayPokemonList[
      seed % todayPokemonList.length
    ];

}
currentTodayPokemon = pokemon;
  const mainType = getMainType(pokemon);
  const typeClass = getTypeClass(mainType);

  const card = document.getElementById("todayCard");

  if(!card){
    return;
  }

  card.className =
  "today-card type-" + typeClass;

if(isRare){
  card.classList.add("today-rare");
}

  document.getElementById("todaySymbol").textContent =
    getTypeSymbol(mainType);

  document.getElementById("todayType").textContent =
    getTypeLabel(mainType);

  document.getElementById("todayName").textContent =
    pokemon.en;

  document.getElementById("todayJP").textContent =
    pokemon.jp;

  document.getElementById("todayNo").textContent =
    "No." + pokemon.no;
}

document.addEventListener("DOMContentLoaded", loadTodayPokemon);

function goTodayPokemonDetail(){
  if(!currentTodayPokemon){
    return;
  }

  const keyword = encodeURIComponent(currentTodayPokemon.en);

  location.href = "pages/namebank.html?search=" + keyword;
}
