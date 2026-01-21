async function getData() {
  const response = await fetch("data/data.json");
  const data = await response.json();

  data.easy[0].text.split("").forEach((letter) => {
    document.querySelector("#app").innerHTML += `<span>${letter}</span>`;
  });

  let count = 0;

  document.addEventListener("keypress", (event) => {
    count++;
    const span = document.querySelector(`#app span:nth-child(${count})`);

    if (span.textContent.toUpperCase() == event.key.toUpperCase())
      span.classList.add("green");
    else span.classList.add("red");

    console.log(
      (
        100 -
        (document.querySelectorAll(`#app span.red`).length /
          document.querySelectorAll(`#app span`).length) *
          100
      ).toFixed(2),
    );
  });

  return data;
}

getData();
