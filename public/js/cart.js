document.addEventListener("DOMContentLoaded", (e) => {
  const numbers = document.querySelectorAll(".numberId");

  numbers.forEach((el, key) => {
    el.innerText = key + 1;
  });
  numbers;
});
