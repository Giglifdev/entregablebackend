import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";
import path from "node:path";

const productsFilePath = path.join(__dirname, "views");
const productManager = new ProductManager(productsFilePath);

const app = express();

/* config for viewsRouter */

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

const server = app.listen(8080, () => console.log("Listening on port 8080"));
const io = new Server(server);
app.set("socket", io);

io.on("connection", (socket) => {
  console.log("new server conected");

  socket.on("add-product", async (data) => {
    try {
      await productManager.addProduct(JSON.parse(data));
      io.emit("show everything", await productManager.getProducts());
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("delete-product", async (data) => {
    try {
      const id = Number(data);
      await productManager.deleteProduct(id);
      io.emit("show everything", await productManager.getProducts());
    } catch {}
  });
});
