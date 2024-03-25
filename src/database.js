const mongoose = require("mongoose");
const configObject = require("./config/config");
const { mongo_url } = configObject;
/*mongoose
  .connect(mongo_url)
  .then(() => console.log("Conexion a la base de datos exitosa"))
  .catch((error) =>
    console.log(
      "Ha ocurrido un error a la hora de conectar a la base de datos",
      error
    )
  );*/

class DataBase {
  static #intance;

  constructor() {
    mongoose.connect(mongo_url);
  }
  static getIntance() {
    if (this.#intance) {
      console.log("Conexion ya existente");
      return this.#intance;
    }
    this.#intance = new DataBase();
    console.log("Conexion exitosa");
    return this.#intance;
  }
}

module.exports = DataBase.getIntance();
