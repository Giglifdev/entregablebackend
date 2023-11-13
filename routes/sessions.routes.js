import { Router } from "express";
import UsersManager from "../dao/dbManagers/users.manager.js";

const router = Router();
const userManager = new UsersManager();

router
  .post("/register", async (req, res) => {
    try {
      const { first_name, last_name, age, email, password } = req.body;
      if (!first_name || !last_name || !age || !email || !password)
        return res
          .status(422)
          .send({ status: "error", message: "incomplete values" });

      const exists = await userManager.getOne({ email });
      if (exists)
        return res
          .status(400)
          .send({ status: "error", message: "user already exists" });
      const result = await userManager.create({
        first_name,
        last_name,
        email,
        age,
        password,
      });

      return res
        .status(201)
        .send({ status: "success", message: "user registered" });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  })
  .post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(422)
          .send({ status: "error", message: "incomplete values" });

      if (
        email.trim() === "adminCoder@coder.com" &&
        password === "adminCod3r123"
      ) {
        req.session.user = {
          name: `Admin Coder`,
          email: email,
          role: "admin",
        };
        return res.send({ status: "success", message: "login success" });
      }
      const user = await userManager.getOne({ email, password });
      if (!user)
        return res
          .status(400)
          .send({ status: "error", message: "incorrect credentials" });
      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: "user",
      };
      return res.send({ status: "success", message: "login success" });
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
    }
  })
  .get("/logout", async (req, res) => {
    req.session.destroy((error) => {
      if (error)
        return res
          .status(500)
          .send({ status: "error", message: error.message });
      return res.redirect("/");
    });
  });

export default router;
