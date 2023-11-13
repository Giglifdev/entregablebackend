const addButton = document.getElementById("add-button");

async function handleClick(e) {
  const target = e.target;
  const id = target.parentElement.id;
  try {
    const resultCart = await fetch(`/api/carts`, {
      method: "POST",
      body: "",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { payload } = await resultCart.json();
    const cartId = payload["_id"];
    const result = await fetch(`/api/carts/${cartId}/products/${id}`, {
      method: "POST",
      body: "",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    if (data.status === "error") {
      console.error(data.message);
    } else {
      alert("Product added successfully");
    }
  } catch (error) {
    console.log(error.message);
  }
}

addButton.addEventListener("click", async (e) => {
  handleClick(e);
});
