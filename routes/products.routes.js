import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.manager.js";

import { productsFilePath } from "../utils.js";

const router = Router();
const manager = new ProductManager();

router
  .get("/", async (req, res) => {
    try {
      const {
        limit = 10,
        page = 1,
        sort,
        query: queryP,
        queryValue,
      } = req.query;
      const options = {
        limit,
        page,
        query: {},
      };
      let sortLink = "";
      if (sort?.toLowerCase() === "asc") {
        options.sort = { price: 1 };
        sortLink = `&sort=${sort}`;
      } else if (sort?.toLowerCase() === "desc") {
        options.sort = { price: -1 };
        sortLink = `&sort=${sort}`;
      }
      if (queryP && queryValue) {
        options.query[queryP] = queryValue;
      }
      const {
        docs: products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        totalPages,
      } = await manager.getAll(options);
      if (!products)
        return res.status(200).send({ status: "success", payload: [] });

      const prevLink = hasPrevPage
        ? `/api/products?limit=${limit}&page=${prevPage}${sortLink}`
        : null;
      const nextLink = hasNextPage
        ? `/api/products?limit=${limit}&page=${nextPage}${sortLink}`
        : null;

      return res.send({
        status: "success",
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })

  .get("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await manager.getById(pid);
      if (!product)
        return res
          .status(404)
          .send({ status: "error", error: "Product not found" });

      return res.send({ status: "success", payload: product });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .post("/", async (req, res) => {
    const options = {
      limit: 10,
      page: 1,
      query: {},
    };
    try {
      const product = req.body;
      const io = req.app.get("socketio");
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        category,
        stock,
        status,
      } = product;
      if (!title || !description || !price || !code || !stock || !category)
        return res
          .status(400)
          .send({ status: "error", error: "Incomplete values" });
      const newProduct = await manager.create(product);
      const { docs: productsEmit } = await manager.getAll(options);
      io.emit("refreshProducts", productsEmit);
      return res.send({ status: "success", payload: newProduct });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .put("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const product = req.body;
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        category,
        stock,
        status,
      } = product;
      if (!title || !description || !price || !code || !stock || !category)
        return res
          .status(400)
          .send({ status: "error", error: "Incomplete values" });

      const productExists = await manager.getById(pid);
      if (!productExists)
        return res
          .status(404)
          .send({ status: "error", error: "Product not found, incorrect id" });

      const updatedProduct = await manager.update(pid, product);
      return res.send({
        status: "success",
        payload: updatedProduct,
      });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  })
  .delete("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const options = {
        limit: 10,
        page: 1,
        query: {},
      };
      const io = req.app.get("socketio");
      const deletedProduct = await manager.delete(pid);
      if (deletedProduct.deletedCount === 0)
        return res
          .status(400)
          .send({ status: "error", error: "Product not found, incorrect id" });

      const { docs: productsEmit } = await manager.getAll(options);
      io.emit("refreshProducts", productsEmit);
      return res.send({
        status: "success",
        payload: "Product deleted succesfully",
      });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  });

export default router;
