const express = require("express");
const router = express.Router();

const CartManager = require("../dao/db/carts-manager-db.js");
const cartManager = new CartManager();

const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.json({ status: "success", message: "Carrito creado" });
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
      res.json({
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
      res.json({
        message: "No se encontro el producto",
      });
      return;
    }

    if (!cartExists) {
      res.json({
        message: "No se encontro el carrito",
      });
      return;
    }

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

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const productsToCart = req.body.products;
  try {
    const cartExists = await cartManager.getCartById(cartId);
    if (!cartExists) {
      res.json({
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
  const { quantity } = req.body;
  try {
    const productExists = await productManager.getProductById(productId);
    const cartExists = await cartManager.getCartById(cartId);

    if (!productExists) {
      res.json({
        message: "No se encontro el producto",
      });
      return;
    }

    if (!cartExists) {
      res.json({
        message: "No se encontro el carrito",
      });
      return;
    }

    const updatedQuantity = await cartManager.addAQuantityOfProduct(
      cartId,
      productId,
      quantity
    );
    res.json({ message: "Productos agregados con exito" }, updatedQuantity);
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
    const productInCartExists = cartExists.products.find(
      (product) => product.id == productId
    );
    if (!productExists) {
      res.json({
        message: "No se encontro el producto",
      });
      return;
    }

    if (!cartExists) {
      res.json({
        message: "No se encontro el carrito",
      });
      return;
    }

    if (!productInCartExists) {
      res.json({
        message: "El producto no se encuentra en el carrito",
      });
      return;
    }

    const updatedQuantity = await cartManager.deleteProductInCart(
      cartId,
      productId
    );
    res.json({ message: "Producto eliminado con exito" }, updatedQuantity);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.body;
  try {
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
