import { Router } from "express";
import MessagesManager from "../dao/dbManagers/messages.manager.js";

const router = Router();

router.get("/", async (req, res) => {
  res.send("Ruta mensajes para más adelante");
});

export default router;
