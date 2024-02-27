const express = require("express");
const router = express.Router();
const UsersModel = require("../dao/models/users.model.js");

const UsersManager = require("../dao/db/users-manager-db");
const usersManager = new UsersManager();

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/failedregister",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales invalidas" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      password: req.user.password,
    };

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/failedregister", (req, res) => {
  res.send({ error: "Error de estrategia" });
});

module.exports = router;
