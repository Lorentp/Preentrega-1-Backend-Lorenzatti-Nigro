const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

router.get("/", productManager.getProducts);

router.get("/:pid", productManager.getProductsById);

router.post("/add", productManager.CreateProducts);

router.put("/update/:pid", productManager.updateProduct);

router.delete("/delete/:pid", productManager.deleteProduct);

module.exports = router;
