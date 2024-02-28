const express = require("express");
const router = express.Router();

const CartManager = require("../dao/db/carts-manager-db.js");
const cartManager = new CartManager();

const ProductManager = require("../dao/db/product-manager-db.js");
const { ReturnDocument } = require("mongodb");
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.status(200).json({ status: "success", message: "Carrito creado" });
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
      res.json(cart.products);
    } else {
      res.status(404).json({
        message: "No se encontro el carrito",
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
    const productExists = await productManager.getProductById(productId);
    const cartExists = await cartManager.getCartById(cartId);

    if (!productExists) {
      res.status(404).json({
        message: "No se encontro el producto",
      });
      return;
    }

    if (!cartExists) {
      res.status(404).json({
        message: "No se encontro el carrito",
      });
      return;
    }

    const updatedCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const productsToCart = req.body;
  try {
    const cartExists = await cartManager.getCartById(cartId);
    if (!cartExists) {
      res.status(404).json({
        message: "No se encontro el carrito",
      });
      return;
    }
    const updatedCart = await cartManager.updateCart(cartId, productsToCart);
    res.json({ message: "Productos agregados con exito" }, updatedCart);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;
  try {
    const productExists = await productManager.getProductById(productId);
    const cartExists = await cartManager.getCartById(cartId);

    if (!productExists) {
      res.status(404).json({
        message: "No se encontro el producto",
      });
      return;
    }

    if (!cartExists) {
      res.status(404).json({
        message: "No se encontro el carrito",
      });
      return;
    }

    await cartManager.addAQuantityOfProduct(cartId, productId, newQuantity);
    res.json({ message: "Productos actualizado con exito" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const productExists = await productManager.getProductById(productId);
    const cartExists = await cartManager.getCartById(cartId);

    if (!productExists) {
      res.status(404).json({
        message: "No se encontro el producto",
      });
      return;
    }

    if (!cartExists) {
      res.status(404).json({
        message: "No se encontro el carrito",
      });
      return;
    }

    await cartManager.deleteProductInCart(cartId, productId);
    res.status(200).json({ message: "Producto eliminado con exito" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartExists = await cartManager.getCartById(cartId);
    if (!cartExists) {
      res.status(404).json({ message: "El carrito no existe" });
      return;
    }
    await cartManager.emptyCart(cartId);
    res.json({ message: "Carrito vaciado con exito" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

module.exports = router;
