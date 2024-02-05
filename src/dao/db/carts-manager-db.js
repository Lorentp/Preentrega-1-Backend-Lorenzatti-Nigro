const CartsModel = require("../models/carts.model.js");
const ProductModel = require("../models/products.model.js");

class CartsManager {
  async createCart() {
    try {
      const newCart = new CartsModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartsModel.findById(cartId);
      if (!cart) {
        console.log("No existe ese carrito con el id");
        return null;
      }

      return cart;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);

      if (!cart) {
        res.json({
          message: "No se encontro el carrito, revise el ID solicitado",
        });
      }

      const productexists = await ProductModel.findById(productId);
      if (!productexists) {
        console.log("El producto no existe");
        res.send("El producto no existe");
        return;
      }

      const productToCart = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (productToCart) {
        productToCart.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }
}

module.exports = CartsManager;
