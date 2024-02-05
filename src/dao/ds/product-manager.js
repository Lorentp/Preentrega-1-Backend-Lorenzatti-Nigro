const fs = require("fs").promises;
const { uuid } = require("uuidv4");
class ProductManager {
  static lastId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async readFile() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(res);
      return arrayProducts;
    } catch (error) {
      console.log("No se pudo leer el archivo", error);
    }
  }

  async saveFile(arrayProducts) {
    try {
      const res = await this.readFile(this.path, "utf8");

      await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    } catch (error) {
      console.log("No se pudo guardar el archivo", error);
    }
  }
  async addProduct({
    title,
    description,
    price,
    image,
    code,
    stock,
    category,
  }) {
    try {
      const arrayProducts = await this.readFile();
      const id = uuid();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        res.send("Todos los campos son obligatorios");
        return;
      }

      if (arrayProducts.some((item) => item.code === code)) {
        console.log("El código debe ser único");
        res.send("El código debe ser único");
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        image,
        code,
        stock,
        category,
        status: true,
        id,
      };

      arrayProducts.push(newProduct);
      await this.saveFile(arrayProducts);
      return newProduct;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async getProducts() {
    try {
      const response = await fs.readFile(this.path, "utf8");
      const responseJSON = JSON.parse(response);
      return responseJSON;
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async getProductsById(id) {
    try {
      const arrayProducts = await this.readFile();
      const product = arrayProducts.find((item) => item.id === id);
      if (!product) {
        console.log("Lo sentimos, producto no encontrado");
        res.send("Lo sentimos, producto no encontrado");
      } else {
        console.log("Su producto es:", product);
        res.send("Su producto es:", product);
        return product;
      }
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }

  async updateProduct(id, { ...updatedProduct }) {
    try {
      const products = await this.getProducts();
      const index = await products.findIndex((product) => product.id == id);

      if (index !== -1) {
        products[index] = { ...updatedProduct, status: true, id: id };
        await this.saveFile(products);
        return [index];
      } else {
        console.log("No se pudo encontrar el producto");
        res.send("No se encontro el producto");
      }
    } catch (error) {
      res.send("No se pudo actualizar el producto");
      console.log("No se pudo actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);

      if (index !== -1) {
        products.splice(index, 1);

        await this.saveFile(products);
      } else {
        console.log("No se pudo encontrar el producto");
      }
    } catch (error) {
      console.log(error);
      res.send("Ha ocurrido un error");
    }
  }
}

module.exports = ProductManager;
