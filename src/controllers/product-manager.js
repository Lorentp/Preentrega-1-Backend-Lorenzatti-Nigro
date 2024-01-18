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
        return;
      }

      if (arrayProducts.some((item) => item.code === code)) {
        console.log("El código debe ser único");
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
      console.log("Error al agregar producto", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const response = await fs.readFile(this.path, "utf8");
      const responseJSON = JSON.parse(response);
      return responseJSON;
    } catch (error) {
      console.log("Ha ocurrido un error", error);
    }
  }

  async getProductsById(id) {
    try {
      const arrayProducts = await this.readFile();
      const product = arrayProducts.find((item) => item.id === id);
      if (!product) {
        console.log("Lo sentimos, producto no encontrado");
      } else {
        console.log("Su producto es: ");
        return product;
      }
    } catch (error) {
      console.log("N se pudo leer el archivo", error);
    }
  }

  async updateProduct(id, { updatedProduct }) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((item) => item.id == id);

      if (index !== -1) {
        updateproduct[index] = {
          id: arrayProducts[index].id,
          title: updatedProduct.title
            ? updatedProduct.title
            : arrayProducts[index].title,
          description: updatedProduct.description
            ? updatedProduct.description
            : arrayProducts[index].description,
          price: updatedProduct.price
            ? updatedProduct.price
            : arrayProducts[index].price,
          image: updatedProduct.image
            ? updatedProduct.image
            : arrayProducts[index].image,
          code: updatedProduct.code
            ? updatedProduct.code
            : arrayProducts[index].code,
          stock: updatedProduct.stock
            ? updatedProduct.stock
            : arrayProducts[index].stock,
          status: updatedProduct.status
            ? updatedProduct.status
            : arrayProducts[index].status,
          category: updatedProduct.category
            ? updatedProduct.category
            : arrayProducts[index].category,
        };
        arrayProducts[index] = updateproduct;
        await this.saveFile(arrayProducts);
        return [index];
      } else {
        console.log("No se pudo encontrar el producto");
      }
    } catch (error) {
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
      console.log("No se pudo eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;
