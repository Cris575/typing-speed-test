"use strict";

import { getData } from "./modules/json";
import { setPersonalBest } from "./modules/storage";

const app = document.querySelector("#app");
const btnRestart = document.querySelector(".btn-restart");
const accuraryPercent = document.querySelector("#percent");
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

const UpdateAccuracy = function () {
  const totalOfElements = app.childElementCount;
  const errors = app.querySelectorAll("div.wrong").length;

  accuracy = calculateAccuracy(totalOfElements, errors);
  accuraryPercent.textContent = `${accuracy}%`;
};

const HandleKeyPress = function (event) {
  if (app.classList.contains("blur")) {
    app.classList.remove("blur");
    btnRestart.classList.add("hide");
    app.firstElementChild.classList.add("active");
    const timerButton = document.querySelector("#opt4:checked");

    if (timerButton) startTimer();
    return;
  }

  const span = getCurrentSpan();
  if (!span) {
    endGame();
    return;
  }

  LetterIndication(span);
  ValidateLetter(span, event.key);
  UpdateAccuracy();

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

  document.querySelector("#btn-restart").addEventListener("click", () => {
    HandleKeyPress();
  });
};

const InitGame = function () {
  RenderText("easy", 0);
  InitKeyboardListener();
  InitOptionsListener();
};

const InitKeyboardListener = function () {
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    if (keysToExclude.includes(event.key)) return;

    HandleKeyPress(event);
  });
};

InitGame();

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

function calculateWPM() {
  const total = app.children.length;
  return total / 5 / parseFloat(timeLeft / 60);
}

function endGame() {
  setPersonalBest(calculateWPM(), calculateWPM(), accuracy, timeLeft);
  window.location.href = "../views/win-page.html";
}
