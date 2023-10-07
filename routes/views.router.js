import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { __dirname } from "../utils.js";
import path from "node:path";

const productsFilePath = path.join(__dirname, "./files/products.json");
const productManager = new ProductManager(productsFilePath);

const router = Router();

router.get("/", async (req, res) => {
  try {
    const stuffs = await productManager.getProducts();
    console.log("Data:", stuffs);
    res.render("home", { stuffs });
  } catch (error) {
    console.error("Error:", error);
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en la obtención de productos");
  }
});

export default router;
