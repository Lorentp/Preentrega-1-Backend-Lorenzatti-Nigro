const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product-controller-db");
const productController = new ProductController();

router.get("/", productController.getProducts);

router.get("/:pid", productController.getProductsById);

router.post("/add", productController.createProducts);

router.put("/update/:pid", productController.updateProduct);

router.delete("/delete/:pid", productController.deleteProduct);

module.exports = router;
