const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();
const ProductModel = require("../dao/models/products.model.js");
const CartsManager = require("../dao/db/carts-manager-db.js");
const cartsManager = new CartsManager();

router.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/chat", async (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/products", async (req, res) => {
  const page = req.query.page || 1;
  const limit = 4;

  try {
    const products = await ProductModel.paginate({}, { limit, page });

    const productsFinal = products.docs.map((product) => {
      const { id, ...rest } = product.toObject();
      return rest;
    });

    res.render("products", {
      title: "products",
      products: productsFinal,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
    });
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await cartsManager.getCarts();

    res.render("carts", { carts });
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartsManager.getCartById(cartId);
    if (!cart) {
      console.log("Error, el carrito no existe");
      return;
    }
    res.render("cart", { cartId, products: cart.products });
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

module.exports = router;
