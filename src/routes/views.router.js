const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager");
const manager = new ProductManager("./src/models/products.json");
const productsJSON = "./src/models/products.json";

router.get("/", async (req, res) => {
  let arrayProducts = await manager.readFile(productsJSON);
  try {
    res.render("index", { arrayProducts });
  } catch (error) {
    console.log("Error del servidor", error);
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (error) {
    console.log("Error del servidor", error);
  }
});

module.exports = router;
