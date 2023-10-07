/* SOCKET LOGIC */

const socket = io();

const addForm = document.getElementById("add-form");
const productInput = document.getElementById("product");

/*ADD*/

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = productInput.values;

  socket.emit("add-product", newProduct);

  productInput.value = "";
});

/* DELETE */

const deleteForm = document.getElementById("delete-form");
const ProductIdInput = document.getElementById("productId");

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const productId = ProductIdInput.value;

  socket.emit("delete-product", productId);

  ProductIdInput.value = "";
});

/* client products */

const cont = document.getElementById("products-container");

socket.on("show everything", (data) => {
  cont.innerHTML = "";

  data.forEach((product) => {
    cont.innerHTML += `
        <ul>
        <li>${product.title}</li>
        <li>${product.price}</li>
        <li>${product.id}</li>
    </ul>
       
        `;
  });
});
