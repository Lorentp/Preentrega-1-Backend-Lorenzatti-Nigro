const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();
const ProductModel = require("../dao/models/products.model.js");

router.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  try {
    let product = await productManager.getProductById(pid);
    if (product) {
      res.send(product);
    } else {
      res.send("Producto no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/", async (req, res) => {
  let { limit, page, sort, query: filterQuery } = req.query;

  try {
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    const filter = {};
    if (filterQuery) {
      filter.category = filterQuery;
    }

    let sortOp = {};
    if (sort) {
      sortOp.price = sort === "asc" ? 1 : -1;
    }

    const arrayProducts = await ProductModel.paginate(filter, {
      limit,
      page,
      sort,
    });

    const ProductList = arrayProducts.docs.map((product) => {
      const { id, ...data } = product.toObject();
      return data;
    });

    const prevPage = arrayProducts.hasPrevPage
      ? `/api/products?limit=${limit}&page=${arrayProducts.prevPage}&sort=${sort}&query=${filterQuery}`
      : null;
    const nextPage = arrayProducts.hasNextPage
      ? `/api/products?limit=${limit}&page=${arrayProducts.nextPage}&sort=${sort}&query=${filterQuery}`
      : null;

    const response = {
      status: "success",
      payload: ProductList,
      totalDocs: arrayProducts.totalDocs,
      totalPages: arrayProducts.totalPages,
      prevPage: arrayProducts.prevPage,
      nextPage: arrayProducts.nextPage,
      page: arrayProducts.page,
      hasPrevPage: arrayProducts.hasPrevPage,
      hasNextPage: arrayProducts.hasNextPage,
      prevPage,
      nextPage,
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.put("/update/:pid", async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const productExists = await productManager.getProductById(productId);

  try {
    if (!productExists) {
      res.json({ message: "El producto no existe" });
      return;
    }
    await productManager.updateProduct(productId, updatedProduct);
    console.log("Producto actualizado correctamtente", updatedProduct);
    res.json({
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.delete("/delete/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

module.exports = router;
