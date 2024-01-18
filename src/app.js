//Puerto
const PORT = 8080;

//Dependencias
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");

//Rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Conexion controllers
const ProductManager = require("./controllers/product-manager");
const manager = new ProductManager("./src/models/products.json");
const productsJSON = "./src/models/products.json";
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
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

const io = socket(httpServer);

io.on("connection", async (socket) => {
  console.log("Nuevo usuario conectado");

  socket.emit("products", await manager.readFile());

  socket.on("deleteProduct", async (id) => {
    await manager.deleteProduct(id);
    io.sockets.emit("products", await manager.readFile());
    console.log("Producto eliminado");
  });

  socket.on("addProduct", async (product) => {
    await manager.addProduct(product);
    io.sockets.emit("products", await manager.readFile());
    console.log("Producto agregado");
  });
});
