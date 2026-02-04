export function getPersonalBest() {
  return localStorage.getItem("personal-best");
}

export function setPersonalBest(personalBest, currentWPM, accuracy, timeLeft) {
  localStorage.setItem(
    "personal-best",
    JSON.stringify({ personalBest, currentWPM, accuracy, timeLeft }),
  );
}
