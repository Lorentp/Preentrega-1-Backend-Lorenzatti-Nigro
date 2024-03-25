const cartsServices = require("../services/cartsServices.js");
const CartsServices = new cartsServices();
const productsServices = require("../services/productsServices.js");
const ProductsServices = new productsServices();
class CartsManager {
  async createCart() {
    try {
      const newCart = await CartsServices.createCart();
      return newCart;
    } catch (error) {
      res.json(error);
    }
  }

  async getCartById() {
    try {
      const cart = await CartsServices.getCartById(req.session.user.cartId);
      return cart;
    } catch (error) {
      res.json(error);
    }
  }

  async addProductToCart() {
    try {
      const cart = await CartsServices.getCartById(req.session.user.cartId);
      const product = await ProductsServices.productExists(req.params.pid);
      const quantity = 1;

      return cart;
    } catch (error) {
      res.json(error);
    }
  }

  async deleteProductInCart() {
    try {
      const cart = await CartsServices.getCartById(req.session.user.cartId);
      const product = await ProductsServices.productExists(req.params.pid);
      return cart;
    } catch (error) {
      res.json(error);
    }
  }
  /*


  async emptyCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) {
        console.log("No se encontro el carrito");
        return null;
      }
      cart.products = [];
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addAQuantityOfProduct(cartId, productId, newQuantity) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) {
        console.log("No se encontro el carrito");
        return null;
      }

      const productInCart = cart.products.find((p) =>
        p.product.equals(productId)
      );
      if (!productInCart) {
        console.log("El producto no existe en el carrito");
        return null;
      }

      productInCart.quantity = newQuantity;
      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(cartId, productsToCart) {
    try {
      const updatedCart = await CartsModel.findByIdAndUpdate(
        cartId,
        { products: productsToCart },
        { new: true }
      );

      if (!updatedCart) {
        console.log("No se encontro el carrito");
        return;
      }
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  }*/
}
module.exports = CartsManager;
