const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cart-manager");
const manager = new CartManager("./src/models/carts.json");

router.post("/", async (req, res) => {
  try {
    await manager.newCart();
    res.send({ status: "success", message: "Carrito creado" });
  } catch (error) {
    res.send("No se pudo crear el carrito");
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await manager.getCartsProducts(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.json({
        message: "No se encontro el carrito, revise el ID solicitado",
      });
    }
  } catch (error) {
    res.send("Error del servidor");
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    await manager.addProductCart(cid, pid, quantity);
    res.send("Producto agregado al carrito");
  } catch (error) {
    res.send("Error, no se pudo agregar el producto al carrito");
  }
});

module.exports = router;
