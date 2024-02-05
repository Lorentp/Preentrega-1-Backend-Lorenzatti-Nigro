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
        return;
      }

      const productexists = await ProductModel.findOne({ code: code });
      if (productexists) {
        console.log("El codigo debe ser unico");
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
        id,
        thumbnails,
      });

      await newProduct.save();
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {}
  }

  async getProductById(_id) {
    try {
      const product = await ProductModel.findById(_id);
      if (!product) {
        console.log("Error, no se encontro el producto");
        return null;
      }

      return product;
    } catch (error) {}
  }

  async updateProduct(id, { updatedProduct }) {
    try {
      const updateProduct = await ProductManager.findByIdAndUpdate(
        id,
        updatedProduct
      );

      if (!updateProduct) {
        console.log();
        return null;
      }

      return updateProduct;
    } catch (error) {
      console.log("No se pudo actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        console.log();
        return null;
      }

      return deletedProduct;
    } catch (error) {
      console.log("No se pudo eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;
