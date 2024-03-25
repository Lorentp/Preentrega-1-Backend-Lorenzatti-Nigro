const CartsModel = require("../models/carts.model.js");
const ProductModel = require("../models/products.model.js");

class CartsServices {
  async createCart() {
    try {
      const newCart = new CartsModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }
  async getCartById(_id) {
    try {
      const cart = await CartsModel.findById(_id);
      if (!cart) {
        console.log("No se encontro el carrito");
        return null;
      }

      return cart;
    } catch (error) {
      console.log(error);
    }
  }
  async productExists(_id) {
    const product = await ProductModel.findById(_id);
    if (!product) {
      return null;
    }
    return product;
  }
  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);

      if (!cart) {
        console.log("No se encontro el carrito");
        return;
      }

      const productexists = await this.productExists(productId);
      if (!productexists) {
        console.log("El producto no existe");
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
  async deleteProductInCart(cartId, productId) {
    try {
      const cart = await CartsModel.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      );

      const productexists = await this.productExists(productId);
      if (!productexists) {
        console.log("El producto no existe");
        return;
      }

      if (!cart) {
        console.log("No se encontro el carrito");
        return null;
      }

      return cart;
    } catch (error) {
      console.log(error);
    }
  }

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
}

module.exports = CartsServices;
