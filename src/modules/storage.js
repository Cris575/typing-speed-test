export function getPersonalBest() {
  return localStorage.getItem("personal-best");
}

export function setPersonalBest(
  personalBestScore,
  // currentWPM,
  accuracy,
  timeLeft,
) {
  localStorage.setItem(
    "personal-best",
    JSON.stringify({
      personalBestScore,
      // finalWPN,
      accuracy,
      timeLeft,
    }),
  );
}
