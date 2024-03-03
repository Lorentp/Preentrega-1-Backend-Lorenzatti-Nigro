const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();
const ProductModel = require("../dao/models/products.model.js");
const CartsManager = require("../dao/db/carts-manager-db.js");
const cartsManager = new CartsManager();

router.get("/", async (req, res) => {
  try {
    if (!req.session.login) {
      return res.redirect("/login");
    }
    res.render("index");
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/products");
  }
  res.render("register");
});

router.get("/login", async (req, res) => {
  try {
    if (req.session.login) {
      return res.redirect("/products");
    }
    res.render("login");
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
  let { limit, page, sort, query: filterQuery } = req.query;

  try {
    if (!req.session.login) {
      return res.redirect("/login");
    }

    limit = parseInt(limit) || 4;
    page = parseInt(page) || 1;
    let sortOp = {};
    if (sort) {
      sortOp.price = sort === "asc" ? 1 : -1;
    }
    const filter = {};
    if (filterQuery) {
      filter.category = filterQuery;
    }

    const products = await ProductModel.paginate(filter, {
      limit,
      page,
      sort: sortOp,
    });

    const productsFinal = products.docs.map((product) => {
      const { id, ...rest } = product.toObject();
      return rest;
    });

    const prevLink = products.hasPrevPage
      ? `/api/products?limit=${limit}&page=${products.prevPage}`
      : null;
    const nextLink = products.hasNextPage
      ? `/api/products?limit=${limit}&page=${products.nextPage}`
      : null;

    res.render("products", {
      title: "products",
      products: productsFinal,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
      prevLink,
      nextLink,
      user: req.session.user,
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
    res.render("cart", {
      cartId,
      products: cart.products,
    });
  } catch (error) {
    console.log("Error del servidor", error);
    res.status(404).json({
      message: "Error de servidor",
      error,
    });
  }
});

module.exports = router;
