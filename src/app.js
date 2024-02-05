//Puerto
const PORT = 8080;

//Dependencias
const express = require("express");
const app = express();

const socket = require("socket.io");

//DataBase
require("./database.js");
//Rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Conexion controllers
const ProductManager = require("./dao/db/product-manager-db.js");
const productManager = new ProductManager();
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Handlebars
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Router
app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Listen
const httpServer = app.listen(PORT, () => {
  console.log("Servidor levantado en el puerto:", PORT);
});

//IO
const MessageModel = require("./dao/models/chat.model.js");
const io = socket(httpServer);

io.on("connection", async (socket) => {
  console.log("Nuevo usuario conectado");
  socket.on("message", async (data) => {
    await MessageModel.create(data);

    const messages = await MessageModel.find();
    io.sockets.emit("message", messages);
  });

  socket.emit("products", await productManager.getProducts());

  socket.on("deleteProduct", async (id) => {
    await manager.deleteProduct(id);
    io.sockets.emit("products", await productManager.getProducts());
    console.log("Producto eliminado");
  });

  socket.on("addProduct", async (product) => {
    await manager.addProduct(product);
    io.sockets.emit("products", await productManager.getProducts());
    console.log("Producto agregado");
  });
});
