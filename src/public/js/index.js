const socket = io();

/*products*/

socket.on("products", (data) => {
  productsDom(data);
});

const productsDom = (products) => {
  const productContainer = document.getElementById("productContainerRealTime");
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card-product");

    card.innerHTML = `
    <img  src="${product.image}" alt="${product.title}">
    <div class="game-title">
      <h5>${product.title}</h5>
      <p>$${product.price}</p>
      
    </div>
    <button class="delete-button">Eliminar producto</button>`;

    productContainer.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(product.id);
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
  alert("Producto eliminado correctamente");
};

document.getElementById("addProductBtn").addEventListener("click", () => {
  addProduct();
  alert("Producto agregado correctamente");
});

const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    image: document.getElementById("image").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };

  socket.emit("addProduct", product);
  console.alert("Producto agregado correctamente");
};
