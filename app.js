import path from "node:path";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import sessionsRouter from "./routes/sessions.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

// message manager
import MessageManager from "./dao/dbManagers/messages.manager.js";

const app = express();
const PORT = 8080;

// db
try {
  await mongoose.connect(
    "mongodb+srv://giglifdev:bhiyHRqwRlTOGVt4@cluster9.wznahdc.mongodb.net/ecommerce?retryWrites=true&w=majority"
  );
  console.log("Database connected");
} catch (error) {
  console.log(error.message);
}

// Engine
app.engine(".handlebars", handlebars.engine({ extname: ".handlebars" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".handlebars");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600,
    }),
    secret: "Coder55575secret",
    resave: true,
    saveUninitialized: true,
  })
);
// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

app.use((req, res) => {
  res.status(404).send({ status: "error", message: "404 not found" });
});

// Sv
const server = app.listen(PORT, () => {
  console.log(`Server is ready on http://localhost:${PORT}`);
});

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
  const messagesManager = new MessageManager();
  console.log("Cliente conectado");

  socket.on("message", async (data) => {
    try {
      const result = await messagesManager.create(data);
      const messages = await messagesManager.getAll();
      socketServer.emit("messageLogs", messages);
    } catch (error) {
      console.error({ error: error.message });
    }
  });

  socket.on("authenticated", async (data) => {
    const messages = await messagesManager.getAll();
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", data);
  });
});

app.set("socketio", socketServer);
