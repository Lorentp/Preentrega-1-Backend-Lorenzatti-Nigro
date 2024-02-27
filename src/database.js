const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://lorentp:Jalnlorenza2000@cluster0.lunvkoc.mongodb.net/ecommere?retryWrites=true&w=majority"
  )
  .then(() => console.log("Conexion a la base de datos exitosa"))
  .catch((error) =>
    console.log(
      "Ha ocurrido un error a la hora de conectar a la base de datos",
      error
    )
  );
