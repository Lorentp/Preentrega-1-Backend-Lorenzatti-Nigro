const express = require("express");
const router = express.Router();

const CartController = require("../controllers/carts-controller-db.js");
const cartController = new CartController();

router.post("/", cartController.createCart);

router.post("/:cid/products/:pid", cartController.addProductToCart);

router.delete("/:cid/products/:pid", cartController.deleteProductInCart);

router.delete("/:cid", cartController.emptyCart);

module.exports = router;
