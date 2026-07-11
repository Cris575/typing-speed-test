"use strict";

import { getData } from "./modules/json";
import { setPersonalBest } from "./modules/storage";

const app = document.querySelector("#app");
let totalOfLetters;
const btnRestart = document.querySelector(".btn-restart");
const accuraryPercent = document.querySelector("#percent");
let isTimerRunning = false;
const keysToExclude = [
  "Enter",
  "Escape",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "Tab",
  "Backspace",
  "CapsLock",
];

let currentIndex = 0;
let accuracy = 0;
let letters = [];
let timeLeft = 60;

const dataJson = await getData();

/* ---------- LOGIC ---------- */

const CalculateAccuracy = (total, errors) => {
  return (100 - (errors / total) * 100).toFixed(2);
};

const LetterIndication = function (span) {
  const next = span.nextSibling;
  const previous = next?.previousSibling;

  next?.classList.add("active");
  previous?.classList.remove("active");
};

const ValidateLetter = function (span, key) {
  const isCorrect = span.textContent.toUpperCase() === key.toUpperCase();
  const _class = isCorrect ? "successes" : "wrong";

  span.classList.add(_class);
};

console.log(totalOfLetters);

const UpdateAccuracy = function () {
  const totalOfElements = totalOfLetters;
  const errors = app.querySelectorAll("div.wrong").length;

  accuracy = CalculateAccuracy(totalOfElements, errors);
  accuraryPercent.textContent = `${accuracy}%`;
};

const HandleKeyPress = function (event) {
  const span = getCurrentSpan();
  if (currentIndex === totalOfLetters) {
    endGame();
    return;
  }

  LetterIndication(span);
  ValidateLetter(span, event.key);
  UpdateAccuracy();

  if (!isTimerRunning) startTimer();

  currentIndex++;
};

/* ---------- UI ---------- */

const RenderText = function (difficulty, level) {
  const text = dataJson[difficulty][level].text;
  if (!text) return;

  letters = text
    .split("")
    .map((letter) => `<div><span>${letter}</span></div>`)
    .join("");

  app.innerHTML = letters;
};

/* ---------- INIT ---------- */

const ChangeDifficulty = function (option) {
  const difficulty = option.target.value;

  RenderText(difficulty, 0);
};

const InitOptionsListener = function () {
  document.querySelectorAll(".option-difficulty").forEach((e) => {
    e.addEventListener("change", ChangeDifficulty);
  });

  document.querySelector("#btn-restart").addEventListener("click", InitGame);
};

const InitKeyboardListener = function () {
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    if (keysToExclude.includes(event.key)) return;

    HandleKeyPress(event);
  });
};

const InitGame = function () {
  app.classList.remove("blur");
  app.firstElementChild.classList.add("active");

  btnRestart.classList.add("hide");
};

(() => {
  RenderText("easy", 0);
  InitKeyboardListener();
  InitOptionsListener();

  totalOfLetters = app.childElementCount;
})();

// InitGame();

/* ---------- PURE FUNCTIONS ---------- */

function getCurrentSpan() {
  return app.children[currentIndex];
}

function startTimer() {
  isTimerRunning = true;

  const timerElement = document.querySelector("#timer");

  const timerInterval = setInterval(() => {
    timeLeft--;
    // timerElement.textContent = `0:${timeLeft < 10 ? "0" + timeLeft : timeLeft}`;
    timerElement.textContent = `0:${timeLeft.toString().padStart(2, "0")}`;
  }, 1000);

  if (timeLeft === 0) clearInterval(timerInterval);

  return timerInterval;
}

function calculateWPM() {
  const total = app.totalOfElements;
  return total / 5 / parseFloat(timeLeft / 60);
}

function endGame() {
  setPersonalBest(calculateWPM(), calculateWPM(), accuracy, timeLeft);
  window.location.href = "../views/win-page.html";
}
