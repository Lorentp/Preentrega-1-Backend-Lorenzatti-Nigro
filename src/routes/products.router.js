const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager");
const manager = new ProductManager("./src/models/products.json");
const productsJSON = "./src/products.json";

router.get("/:pid", async (req, res) => {
  let pid = parseInt(req.params.pid);
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
    res.send({
      status: "success",
      message: "Producto creado",
      product: { newProduct },
    });
  } catch (error) {
    console.log("Ha ocurrido un error:", error);
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { ...data } = req.body;
  try {
    await manager.updateProduct(pid, { ...data });
    res.send({ status: "success", message: "producto actualizado" });
  } catch (error) {
    console.log("Ha ocurrido un error:", error);
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await manager.deleteProduct(pid);
    res.send("Producto eliminado");
  } catch (error) {
    res.send("No se pudo eliminar el producto", error);
  }
});

module.exports = router;
