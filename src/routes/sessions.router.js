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

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Error de estrategia");
  res.send({ error: "fail" });
});

router.get("/logout", async (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }

  res.status(200).send({ message: "Session deslogueada" }).redirect("/login");
});

module.exports = router;
