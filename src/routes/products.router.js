const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager");
const manager = new ProductManager("./src/models/products.json");
const productsJSON = "./src/products.json";

router.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  try {
    let product = await manager.getProductsById(pid);
    if (product) {
      res.send(product);
    } else {
      res.send("Producto no encontrado");
    }
  } catch (error) {
    res.send("Ha ocurrido un error", error);
  }
});

router.get("/", async (req, res) => {
  try {
    let limit = await parseInt(req.query.limit);
    let arrayProducts = await manager.readFile(productsJSON);
    if (limit) {
      const arrayProductsLimit = arrayProducts.slice(0, limit);
      res.send(arrayProductsLimit);
    } else {
      res.send(arrayProducts);
    }
  } catch (error) {
    res.send("Ha ocurrido un error", error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    await manager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el producto" });
  }
});

router.put("/update/:pid", async (req, res) => {
  const { pid } = req.params;
  const { ...data } = req.body;
  try {
    await manager.updateProduct(pid, { ...data });
    res.json({ message: "Producto Actualizado Exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

router.delete("/delete/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await manager.deleteProduct(pid);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

module.exports = router;
