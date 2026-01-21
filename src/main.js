'use strict';

import { getData } from "./modules/json";

const app = document.querySelector("#app");

let currentIndex = 0;
let letters = [];

const dataJson = await getData();


initGame('easy', 0)
initKeyboardListener();

/* ---------- INIT ---------- */

function initGame(difficulty, level) {
  const text = dataJson[difficulty][level].text;
  if (!text) return;

  letters = text.split("");
  renderText(letters);
  initOptionsListener();
}

function initKeyboardListener() {
  document.addEventListener("keydown", handleKeyPress);
}

function initOptionsListener() {
  document.querySelectorAll("input[type='radio']").forEach(e =>{
    e.addEventListener('change', changeDifficulty)
  })
}

function changeDifficulty(option){
  const difficulty = option.target.value;
  const level = Math.floor(Math.random() * 10);

  initGame(difficulty, level);
}

/* ---------- UI ---------- */

function renderText(letters) {
  app.innerHTML = letters
    .map(letter => `<span>${letter}</span>`)
    .join("");
}

/* ---------- LOGIC ---------- */

function handleKeyPress(event) {
  const span = getCurrentSpan();
  if (!span) return;

  validateLetter(span, event.key);
  updateAccuracy();

  currentIndex++;
}

function validateLetter(span, key) {
  const isCorrect =
    span.textContent.toUpperCase() === key.toUpperCase();

  span.classList.add(isCorrect ? "successes" : "wrong");
}

function updateAccuracy() {
  const total = app.children.length;
  const errors = app.querySelectorAll("span.wrong").length;

  const accuracy = calculateAccuracy(total, errors);
  document.querySelector("#percent").textContent = accuracy + "%";
}

/* ---------- PURE FUNCTIONS ---------- */

function calculateAccuracy(total, errors) {
  return (100 - (errors / total) * 100).toFixed(2);
}

function getCurrentSpan() {
  return app.children[currentIndex];
}
