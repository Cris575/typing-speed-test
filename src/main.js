'use-strict'

import { getData } from "./modules/json";

const dataJson = await getData();
let text = "";
let count = 0;

document.addEventListener("keypress", (event)=>{
  count++;
  checkLetter(event,count)
})

getText('easy', 0)
//console.log(dataJson);

function getText(difficulty, level){
  text = dataJson[difficulty][level].text;

  if(text !== '')
    showText()
}

function showText(){
  text.split("").forEach((letter) =>{
      document.querySelector("#app").innerHTML += `<span>${letter}</span>`;
  });
}

function checkLetter(event,count){
  const span = document.querySelector(`#app span:nth-child(${count})`);

  if(span.textContent.toUpperCase() == event.key.toUpperCase())
    span.classList.add("green");
  else span.classList.add("red");

  calculateAccurary();
}

function calculateAccurary(){
   console.log(
      (
        100 -
        (document.querySelectorAll(`#app span.red`).length /
          document.querySelectorAll(`#app span`).length) *
          100
      ).toFixed(2),
    );
}