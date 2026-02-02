"use strict";

import { getData } from "./modules/json";
import confetti from "@hiseb/confetti";

const app = document.querySelector("#app");

let currentIndex = 0;
let accuracy = 0;
let letters = [];
let timeLeft = 60;

const dataJson = await getData();

initGame("easy", 0);
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
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    handleKeyPress(event);
  });
}

function initOptionsListener() {
  document.querySelectorAll("input[name='option-difficulty']").forEach((e) => {
    e.addEventListener("change", changeDifficulty);
  });
}

function changeDifficulty(option) {
  const difficulty = option.target.value;
  const level = Math.floor(Math.random() * 10);

  initGame(difficulty, level);
}

/* ---------- UI ---------- */

function renderText(letters) {
  app.innerHTML = letters
    .map((letter) => `<div><span>${letter}</span></div>`)
    .join("");
}

/* ---------- LOGIC ---------- */

function handleKeyPress(event) {
  if (app.classList.contains("blur")) {
    app.classList.remove("blur");
    app.firstChild.classList.add("active");
    const timerButton = document.querySelector("#opt4:checked");

    if (timerButton) startTimer();
    return;
  }

  const span = getCurrentSpan();
  if (!span) {
    endGame();
    return;
  }

  letterIndication(span);
  validateLetter(span, event.key);
  updateAccuracy();

  currentIndex++;
}

function letterIndication(span) {
  const next = span.nextSibling;
  const previous = next?.previousSibling;

  next?.classList.add("active");
  previous?.classList.remove("active");
}

function validateLetter(span, key) {
  const isCorrect = span.textContent.toUpperCase() === key.toUpperCase();

  span.classList.add(isCorrect ? "successes" : "wrong");
}

function updateAccuracy() {
  const total = app.children.length;
  const errors = app.querySelectorAll("div.wrong").length;

  accuracy = calculateAccuracy(total, errors);
  document.querySelector("#percent").textContent = accuracy + "%";
}

/* ---------- PURE FUNCTIONS ---------- */

function calculateAccuracy(total, errors) {
  return (100 - (errors / total) * 100).toFixed(2);
}

function getCurrentSpan() {
  return app.children[currentIndex];
}

function startTimer() {
  const timerElement = document.querySelector("#timer");
  timeLeft = 60;

  // TODO: clear setInterval

  const timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `0:${timeLeft < 10 ? "0" + timeLeft : timeLeft}`;
  }, 1000);

  setTimeout(() => clearInterval(timerInterval), 60000);

  return timerInterval;
}

function endGame() {
  confetti();
  app.classList.add("hide");
  document.querySelector("#win-page").classList.remove("hide");
  document.querySelector("#win-page #percent").textContent = accuracy + "%";
  document.querySelector("#win-page #timer").textContent = timeLeft + "s";
}
