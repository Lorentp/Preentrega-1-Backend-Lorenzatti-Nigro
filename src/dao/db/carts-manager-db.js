const CartsModel = require("../models/carts.model.js");

class CartsManager {
  async createCart() {
    try {
      const newCart = new CartsModel({ products: [] });
      await newCart.save();
    } catch (error) {}
  }

  async getCartById(cartId) {
    try {
      const cart = await CartsModel.findById(cartId);
    } catch (error) {}
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      const productexists = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (productexists) {
        productexists.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {}
  }
}

module.exports = CartsManager;
