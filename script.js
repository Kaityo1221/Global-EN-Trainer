"use strict";

let currentTodayPokemon = null;

function getRootPrefix(){
  return window.location.pathname.includes("/pages/") ? "../" : "./";
}

function getCurrentPage(){
  const file = window.location.pathname.split("/").pop() || "index.html";

  if(file === "" || file === "index.html") return "home";
  if(file === "namebank.html") return "bank";
  if(file === "dailyquiz.html") return "quiz";
  if(["quest.html","namearena.html","namearena-game.html"].includes(file)) return "quest";
  if(file === "settings.html") return "settings";
  return "home";
}

function isImmersivePage(){
  const file = window.location.pathname.split("/").pop();
  return ["quest.html","namearena.html","namearena-game.html"].includes(file);
}

function ensureHeadMetadata(){
  const root = getRootPrefix();
  const viewport = document.querySelector('meta[name="viewport"]');

  if(viewport){
    viewport.content = "width=device-width,initial-scale=1,viewport-fit=cover";
  }

  if(!document.querySelector('link[data-get-foundation]')){
    const foundation = document.createElement("link");
    foundation.rel = "stylesheet";
    foundation.href = root + "css/foundation.css?v=1";
    foundation.dataset.getFoundation = "true";
    document.head.appendChild(foundation);
  }

  if(!document.querySelector('link[rel="manifest"]')){
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = root + "manifest.webmanifest";
    document.head.appendChild(manifest);
  }

  if(!document.querySelector('link[rel="apple-touch-icon"]')){
    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = root + "assets/images/sheep.PNG";
    document.head.appendChild(appleIcon);
  }

  const metas = [
    ["theme-color","#ea580c"],
    ["apple-mobile-web-app-capable","yes"],
    ["apple-mobile-web-app-status-bar-style","default"],
    ["apple-mobile-web-app-title","GET"]
  ];

  metas.forEach(([name,content]) => {
    if(document.querySelector(`meta[name="${name}"]`)) return;
    const meta = document.createElement("meta");
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  });
}

function getPageTitle(){
  const labels = {
    home:"HOME",
    bank:"NAME BANK",
    quiz:"DAILY QUIZ",
    quest:"EN QUEST",
    settings:"SETTINGS"
  };

  return labels[getCurrentPage()] || "GET";
}

function createAppShell(){
  document.body.classList.add("get-app");

  if(isImmersivePage()){
    document.body.classList.add("get-immersive");
    return;
  }

  const root = getRootPrefix();
  const current = getCurrentPage();

  if(!document.querySelector(".get-app-bar")){
    const header = document.createElement("header");
    header.className = "get-app-bar";
    header.innerHTML = `
      <div class="get-app-brand">
        <img class="get-app-logo" src="${root}assets/images/sheep.PNG" alt="GET Sheep">
        <div class="get-app-title">
          ${getPageTitle()}
          <small>GLOBAL EN TRAINER</small>
        </div>
      </div>
      <div id="getNetworkStatus" class="get-network-status" role="status" aria-live="polite">ONLINE</div>
    `;
    document.body.prepend(header);
  }

  if(!document.querySelector(".get-bottom-nav")){
    const items = [
      ["home","⌂","Home",root + "index.html"],
      ["bank","▣","Bank",root + "pages/namebank.html"],
      ["quiz","?","Quiz",root + "pages/dailyquiz.html"],
      ["quest","✦","Quest",root + "pages/quest.html"],
      ["settings","⚙","Settings",root + "pages/settings.html"]
    ];

    const nav = document.createElement("nav");
    nav.className = "get-bottom-nav";
    nav.setAttribute("aria-label","メインナビゲーション");
    nav.innerHTML = items.map(([key,icon,label,href]) => `
      <a href="${href}" class="${key === current ? "is-active" : ""}" ${key === current ? 'aria-current="page"' : ""}>
        <span class="get-nav-icon" aria-hidden="true">${icon}</span>
        <span>${label}</span>
      </a>
    `).join("");
    document.body.appendChild(nav);
  }

  updateNetworkStatus();
}

function updateNetworkStatus(){
  const status = document.getElementById("getNetworkStatus");
  if(!status) return;

  const online = navigator.onLine;
  status.textContent = online ? "ONLINE" : "OFFLINE";
  status.classList.toggle("is-offline",!online);
}

function showUpdateToast(message){
  const oldToast = document.querySelector(".get-update-toast");
  if(oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = "get-update-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(),4200);
}

function registerServiceWorker(){
  if(!("serviceWorker" in navigator)) return;

  const root = getRootPrefix();

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(root + "sw.js", {scope:root})
      .then(registration => {
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if(!worker) return;

          worker.addEventListener("statechange", () => {
            if(worker.state === "installed" && navigator.serviceWorker.controller){
              showUpdateToast("GETの新しいデータを準備したわ。次回起動から反映されます。");
            }
          });
        });
      })
      .catch(error => console.warn("Service Worker registration failed.",error));
  });
}

window.openMenu = function(){
  const menu = document.getElementById("sideMenu");
  if(menu) menu.classList.add("open");
};

window.closeMenu = function(){
  const menu = document.getElementById("sideMenu");
  if(menu) menu.classList.remove("open");
};

function getMainType(pokemon){
  return pokemon && Array.isArray(pokemon.types) && pokemon.types.length
    ? pokemon.types[0]
    : "ノーマル";
}

function getTypeClass(type){
  const map = {
    "ノーマル":"normal","ほのお":"fire","みず":"water","くさ":"grass",
    "でんき":"electric","エスパー":"psychic","こおり":"ice",
    "かくとう":"fighting","どく":"poison","じめん":"ground",
    "ひこう":"flying","むし":"bug","いわ":"rock","ゴースト":"ghost",
    "ドラゴン":"dragon","あく":"dark","はがね":"steel","フェアリー":"fairy"
  };
  return map[type] || "normal";
}

function getTypeLabel(type){
  const map = {
    "ノーマル":"NORMAL","ほのお":"FIRE","みず":"WATER","くさ":"GRASS",
    "でんき":"ELECTRIC","エスパー":"PSYCHIC","こおり":"ICE",
    "かくとう":"FIGHTING","どく":"POISON","じめん":"GROUND",
    "ひこう":"FLYING","むし":"BUG","いわ":"ROCK","ゴースト":"GHOST",
    "ドラゴン":"DRAGON","あく":"DARK","はがね":"STEEL","フェアリー":"FAIRY"
  };
  return map[type] || "NORMAL";
}

function getTypeSymbol(type){
  const map = {
    "ノーマル":"✦","ほのお":"🔥","みず":"💧","くさ":"🍃","でんき":"⚡",
    "エスパー":"✦","こおり":"❄","かくとう":"拳","どく":"☠","じめん":"◆",
    "ひこう":"羽","むし":"✣","いわ":"◇","ゴースト":"👻","ドラゴン":"✦",
    "あく":"☾","はがね":"⬢","フェアリー":"✧"
  };
  return map[type] || "✦";
}

async function loadTodayPokemon(){
  const card = document.getElementById("todayCard");
  if(!card || !window.GETPokemonData) return;

  try{
    const daily = await window.GETPokemonData.getDailyPokemon();
    const pokemon = daily.pokemon;
    const mainType = getMainType(pokemon);

    currentTodayPokemon = pokemon;
    card.className = "today-card type-" + getTypeClass(mainType);
    card.classList.toggle("today-rare",Boolean(daily.isRare));

    const symbol = document.getElementById("todaySymbol");
    const type = document.getElementById("todayType");
    const name = document.getElementById("todayName");
    const jp = document.getElementById("todayJP");
    const no = document.getElementById("todayNo");

    if(symbol) symbol.textContent = getTypeSymbol(mainType);
    if(type) type.textContent = getTypeLabel(mainType);
    if(name) name.textContent = pokemon.en;
    if(jp) jp.textContent = pokemon.jp;
    if(no) no.textContent = "No." + String(pokemon.no).padStart(3,"0");
  }catch(error){
    console.error("Today's Pokémon loading failed.",error);
  }
}

window.goTodayPokemonDetail = function(){
  if(!currentTodayPokemon) return;
  const keyword = encodeURIComponent(currentTodayPokemon.en);
  window.location.href = getRootPrefix() + "pages/namebank.html?search=" + keyword;
};

ensureHeadMetadata();
registerServiceWorker();

window.addEventListener("online",updateNetworkStatus);
window.addEventListener("offline",updateNetworkStatus);

document.addEventListener("keydown",event => {
  if(event.key === "Escape") window.closeMenu();
});

document.addEventListener("DOMContentLoaded", () => {
  createAppShell();
  loadTodayPokemon();
  console.log("GET app shell initialized");
});
