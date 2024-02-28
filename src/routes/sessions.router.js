const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user)
      return res.status(400).send({
        status: "error",
        message: "Error al iniciar sesion, usuario incorreto",
      });

    if (req.user.email === "adminCoder@coder.com") {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: "admin",
      };
    } else {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      };
    }

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Error de estrategia");
  res.send({ error: "fail" });
});

router.get("/logout", async (req, res) => {
  try {
    if (req.session.login) {
      req.session.destroy();
    }

    res.status(200).redirect("/login");
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
