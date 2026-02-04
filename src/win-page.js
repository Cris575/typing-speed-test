import confetti from "@hiseb/confetti";
import { getPersonalBest } from "../src/modules/storage";

const bestScoreElement = document.querySelector("#best-score");
const personalBest = document.querySelector("#personal-best");
const accuracyElement = document.querySelector("#accuracy");
const timeLeftElement = document.querySelector("#time-left");

(() => {
  const bestScore = JSON.parse(getPersonalBest());

  accuracyElement.textContent = `Accuracy: ${parseFloat(bestScore.accuracy).toFixed(2)}%`;
  timeLeftElement.textContent = `Time Left: ${bestScore.timeLeft}s`;
  personalBest.textContent = `Personal Best: ${parseFloat(bestScore.personalBest).toFixed(2)} WPM`;
  //   bestScoreElement.textContent = `Best Score: ${bestScore.currentWPM} WPM`;
  confetti();
})();
