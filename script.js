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