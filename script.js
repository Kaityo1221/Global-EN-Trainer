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

  const today = new Date("2026-05-28");

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const pokemon =
    todayPokemonList[
      seed % todayPokemonList.length
    ];

  const mainType = getMainType(pokemon);
  const typeClass = getTypeClass(mainType);

  const card = document.getElementById("todayCard");

  if(!card){
    return;
  }

  card.className = "today-card type-" + typeClass;

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

