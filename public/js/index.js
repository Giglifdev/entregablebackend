const socket = io();

const container = document.getElementById("container");
const form = document.getElementById("product-form");
const botones = document.querySelectorAll(".delete-button");

form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = Object.fromEntries(new FormData(evt.target));

  try {
    let result = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    if (result.status === 400) return "Rellenar los campos";
  } catch (error) {
    console.log(error.message);
  }
});

async function handleButtonClick(e) {
  const target = e.target;

  const id = target.id;
  let result = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
}

botones.forEach((boton) => {
  boton.addEventListener("click", handleButtonClick);
});

socket.on("refreshProducts", (data) => {
  container.innerHTML = ``;
  data.forEach((product) => {
    container.innerHTML += `
    <section style="padding: 1.5rem">
      <div style="display: flex; flex-direction: column; gap: 10px; padding-bottom:0.8rem">
          <h3 style="margin-bottom: 0;">title: ${product.title}</h3> 
          <p style="margin: 0;">code: ${product.code}</p>
          <p style="margin: 0;">description: ${product.description}</p>
          <span style="margin: 0;">price: $${product.price}</span>
          <p style="margin: 0;">status: ${product.status}</p>
          <span style="margin: 0;">stock: ${product.stock}</span>
      </div>
      <button class="delete-button" id=${product.id} style="background-color: red; padding:5px 10px; border-radius:25px; cursor:pointer; font-weight:bold">Eliminar</button>
    </section>
    `;
  });
});
