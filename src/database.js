const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://loren:jalnlorenza@coderbackend.zwmjgoq.mongodb.net/?retryWrites=true&w=majority&appName=coderbackend"
  )
  .then(() => console.log("Conexion a la base de datos exitosa"))
  .catch((error) =>
    console.log(
      "Ha ocurrido un error a la hora de conectar a la base de datos",
      error
    )
  );
