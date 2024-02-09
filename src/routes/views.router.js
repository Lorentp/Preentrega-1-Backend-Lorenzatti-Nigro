const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  let arrayProducts = await productManager.getProducts();
  try {
    res.render("index", { arrayProducts });
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

module.exports = router;
