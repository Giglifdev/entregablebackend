import { Router } from "express";
import UsersManager from "../dao/dbManagers/users.manager.js";
import passport from "passport";

const router = Router();
const userManager = new UsersManager();

router
  .post(
    "/register",
    passport.authenticate("register", { failureRedirect: "fail-register" }),
    async (req, res) => {
      return res
        .status(201)
        .send({ status: "success", message: "user registered" });
    }
  )
  .get("/fail-register", async (req, res) => {
    return res.status(500).send({ status: "error", message: "register fail" });
  })
  .post(
    "/login",
    passport.authenticate("login", { failureRedirect: "fail-login" }),
    async (req, res) => {
      if (!req.user)
        return res
          .status(401)
          .send({ status: "error", message: "invalid credentials" });

      req.session.user = {
        name: `${req.user.first_name} ${
          req.user?.last_name ? req.user?.last_name : ""
        }`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      };
      console.log("HELLO");
      return res.send({ status: "success", message: "login success" });
    }
  )
  .get("/fail-login", async (req, res) => {
    return res.status(500).send({ status: "error", message: "login fail" });
  })
  .get("/logout", async (req, res) => {
    req.session.destroy((error) => {
      if (error)
        return res
          .status(500)
          .send({ status: "error", message: error.message });
      return res.redirect("/");
    });
  })
  .get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {
      res.send({ status: "success", message: "user registered" });
    }
  )
  .get(
    "/github-callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
      req.session.user = {
        name: `${req.user.first_name} ${
          req.user?.last_name ? req.user?.last_name : ""
        }`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      };
      return res.redirect("/products");
    }
  );

export default router;
