const ProductModel = require("../models/products.model.js");

class ProductManager {
  async addProduct({
    title,
    description,
    price,
    image,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        res.send("Todos los campos son obligatorios");
        return;
      }

      const productexists = await ProductModel.findOne({ code: code });
      if (productexists) {
        console.log("El codigo debe ser unico");
        res.send("El codigo debe ser unico");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        image,
        code,
        stock,
        category,
        status: true,
        thumbnails,
      });

      await newProduct.save();
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        console.log("Error, no se encontro el producto");
        res.send("Error, no se encontro el producto");
        return null;
      }

      return product;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async updateProduct(id, updatedProductData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updatedProductData
      );

      if (!updatedProduct) {
        console.log("Error, no se encontro el producto");
        res.json("Error, no se encontro el producto");
        return null;
      }

      return updatedProduct;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        console.log("Error, no se encontro el producto");
        res.json("Error, no se encontro el producto");
        return null;
      }

      return deletedProduct;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }
}

module.exports = ProductManager;
