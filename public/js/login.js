const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => {
    obj[key] = value;
  });
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace("/products");
    }
    if (result.status === 400) {
      alert("Incorrect credentials");
    }
  });
});
