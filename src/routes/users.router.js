const express = require("express");
const router = express.Router();
const passport = require("passport");
const UsersModel = require("../dao/models/users.model.js");

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "api/sessions/failedregister",
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
      role: "usuario",
    };
  }
);

router.get("/failedregister", (req, res) => {
  res.send({ error: "Error de estrategia" });
});

module.exports = router;
