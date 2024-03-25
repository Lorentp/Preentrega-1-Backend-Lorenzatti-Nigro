//Puerto
const PORT = 8080;

//Dependencias
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const socket = require("socket.io");
const MongoStore = require("connect-mongo");
require("dotenv").config();

//DataBase
require("./database.js");
//Rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const usersRouter = require("./routes/users.router.js");

//Conexion controllers
const ProductManager = require("./controllers/product-controller-db.js");
const productManager = new ProductManager();
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(
  session({
    secret: "secretSession",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://loren:jalnlorenza@coderbackend.zwmjgoq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=coderbackend",
      ttl: 100,
    }),
  })
);

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

//Passport
const initializePassport = require("./config/passport.config.js");
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Router
app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", usersRouter);

//Listen
const httpServer = app.listen(PORT, () => {
  console.log("Servidor levantado en el puerto:", PORT);
});

//IO
const MessageModel = require("./models/chat.model.js");
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
    await productManager.deleteProduct(id);
    io.sockets.emit("products", await productManager.getProducts());
    console.log("Producto eliminado");
  });

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    io.sockets.emit("products", await productManager.getProducts());
    console.log("Producto agregado");
  });
});
