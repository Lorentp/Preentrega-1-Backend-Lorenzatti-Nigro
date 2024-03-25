const productsServices = require("../services/productsServices.js");
const ProductsServices = new productsServices();

/*
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

      await newProduct.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getLimitProducts(limit) {
    try {
      const arrayProducts = await ProductModel.find();
      if (limit) {
        return arrayProducts.slice(0, limit);
      }

      return arrayProducts;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        console.log("Error, no se encontro el producto");
        return null;
      }

      return product;
    } catch (error) {
      console.log(error);
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

        return null;
      }

      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        console.log("Error, no se encontro el producto");
        return null;
      }
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  }
}*/

class ProductManager {
  async CreateProducts() {
    try {
      const newProduct = await ProductsServices.CreateProducts(req.body);
      return newProduct;
    } catch (error) {
      res.json(error);
    }
  }

  async getProducts() {
    try {
      const products = await ProductsServices.getProducts();
      return products;
    } catch (error) {
      res.json(error);
    }
  }

  async getProductsById() {
    try {
      const product = await ProductsServices.getProductsById(req.params.pid);
      return product;
    } catch (error) {
      res.json(error);
    }
  }
  async updateProduct() {
    try {
      const updatedProduct = await ProductsServices.updateProduct(
        req.params.pid,
        req.body
      );
      return updatedProduct;
    } catch (error) {
      res.json(error);
    }
  }

  async deleteProduct() {
    try {
      const deletedProduct = await ProductsServices.deleteProduct(
        req.params.pid
      );
      return deletedProduct;
    } catch (error) {
      res.json(error);
    }
  }
}
module.exports = ProductManager;
