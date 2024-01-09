const fs = require("fs").promises;
const { uuid } = require("uuidv4");

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.getCarts();
  }

  async getCarts() {
    try {
      const res = await fs.readFile(this.path, "utf8");
      const resJSON = JSON.parse(res);
      return resJSON;
    } catch (error) {
      console.log("Ha ocurrido un error:", error);
    }
  }

  async saveFile(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.log("No se pudo guardar el archivo", error);
    }
  }

  async getCartProducts(id) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id == id);

    if (cart) {
      return cart.poducts;
    } else {
      console.log("carrito no encontrado");
    }
  }

  async newCart() {
    const id = uuid();
    const newCart = { id, products: [] };
    this.carts = await this.getCarts();
    this.carts.push(newCart);
    await this.saveFile(this.carts);
    return newCart;
  }

  async addProductCart(cartId, productId, quantity = 1) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id == cartId);

      const prodInCart = cart.products.find((p) => p.product === productId);
      if (prodInCart) {
        prodInCart.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.log("Ha ocurrido un error:", error);
    }
  }
}

module.exports = CartManager;
