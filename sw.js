"use strict";

const CACHE_VERSION = "get-v1-phase2-20260807a";
const CORE_CACHE = CACHE_VERSION + "-core";
const RUNTIME_CACHE = CACHE_VERSION + "-runtime";
const MATCH_OPTIONS = {ignoreSearch:true};

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./style.css",
  "./css/foundation.css",
  "./css/daily-home.css",
  "./css/bank.css",
  "./css/bank-v2.css",
  "./css/quiz.css",
  "./css/quest.css",
  "./css/settings.css",
  "./css/namearena.css",
  "./css/namearena-game.css",
  "./script.js",
  "./js/app-settings.js",
  "./js/pokemon-data.js",
  "./js/daily-training.js",
  "./js/pokemon.js",
  "./js/quiz.js",
  "./js/quiz-data-bridge.js",
  "./js/quest.js",
  "./js/quest-fixes.js",
  "./js/storage.js",
  "./js/namearena-game.js",
  "./js/namearena-data-bridge.js",
  "./data/ca-phrases.js",
  "./pages/namebank.html",
  "./pages/dailyquiz.html",
  "./pages/quest.html",
  "./pages/settings.html",
  "./pages/namearena.html",
  "./pages/namearena-game.html",
  "./assets/images/sheep.PNG",
  "./assets/images/speaker.png",
  "./data/gen1.json",
  "./data/gen2.json",
  "./data/gen3.json",
  "./data/gen4.json",
  "./data/gen5.json",
  "./data/gen6.json",
  "./data/gen7.json",
  "./data/gen8.json",
  "./data/gen9.json"
];

self.addEventListener("install",event => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate",event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith("get-") && ![CORE_CACHE,RUNTIME_CACHE].includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch",event => {
  const request = event.request;
  const url = new URL(request.url);

  if(request.method !== "GET" || url.origin !== self.location.origin){
    return;
  }

  if(request.mode === "navigate"){
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request,copy));
          return response;
        })
        .catch(async () => (
          await caches.match(request,MATCH_OPTIONS) ||
          await caches.match("./index.html",MATCH_OPTIONS) ||
          await caches.match("./offline.html",MATCH_OPTIONS)
        ))
    );
    return;
  }

  event.respondWith(
    caches.match(request,MATCH_OPTIONS).then(cached => {
      const network = fetch(request)
        .then(response => {
          if(response && response.ok){
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request,copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
