const ProductModel = require("../models/products.model");

class ProductsServices {
  async createProducts(
    title,
    description,
    price,
    image,
    code,
    stock,
    category,
    thumbnails
  ) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return null;
      }

      const productexists = await ProductModel.findOne({ code: code });
      if (productexists) {
        console.log("El codigo debe ser unico");
        return null;
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
      console.log(newProduct);
      return await newProduct.save();
    } catch (error) {
      throw new Error("Error al crear el productos");
    }
  }

  async getProducts() {
    try {
      return await ProductModel.find();
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async getProductsById(_id) {
    try {
      const product = await ProductModel.findById(_id);
      if (!product) {
        console.log("Error, no se encontro el producto");
        return null;
      }

      return product;
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async updateProduct(_id, updatedProductData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        _id,
        updatedProductData
      );

      if (!updatedProduct) {
        console.log("Error, no se encontro el producto");

        return null;
      }

      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(_id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(_id);

      if (!deletedProduct) {
        console.log("Error, no se encontro el producto");
        return null;
      }
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductsServices;
