const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

router.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  try {
    let product = await productManager.getProductsById(pid);
    if (product) {
      res.send(product);
    } else {
      res.send("Producto no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.send("Ha ocurrido un error");
  }
});

router.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let arrayProducts = await productManager.getProducts();
    if (limit) {
      const arrayProductsLimit = arrayProducts.slice(0, limit);
      res.send(arrayProductsLimit);
    } else {
      res.send(arrayProducts);
    }
  } catch (error) {
    console.log(error);
    res.send("Ha ocurrido un error");
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    console.log(error);
    res.send("Ha ocurrido un error");
  }
});

router.put("/update/:pid", async (req, res) => {
  const id = req.params.pid;
  const updatedProduct = req.body;

  try {
    await productManager.updateProduct(id, updatedProduct);
    console.log("Producto actualizado correctamtente", updatedProduct);
    res.json({
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.send("Ha ocurrido un error");
  }
});

router.delete("/delete/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    res.send("Ha ocurrido un error");
  }
});

module.exports = router;
