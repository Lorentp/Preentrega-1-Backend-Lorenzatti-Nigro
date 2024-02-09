const express = require("express");
const router = express.Router();

const CartManager = require("../dao/db/carts-manager-db.js");
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.send({ status: "success", message: "Carrito creado" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.json({
        message: "No se encontro el carrito, revise el ID solicitado",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  try {
    const updatedCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );

    res.json(updatedCart.products);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

module.exports = router;
