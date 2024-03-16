const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isValidPassword } = require("../utils/hashBcrypt");
const UsersModel = require("../dao/models/users.model");

router.post(
  "/login",
  async (req, res, next) => {
    const { email, password } = req.body;
    /*
    if (!email && !password) {
      return res.redirect("/login");
    }
    if (!email) {
      return res.redirect("/login");
    }
    if (!password) {
      return res.redirect("/login");
    }
    */
    const adminUser = {
      username: "Admin",
      first_name: "Private",
      last_name: "Private",
      age: "Private",
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
      role: "admin",
    };

    if (email === adminUser.email && password === adminUser.password) {
      req.session.login = true;
      req.session.user = { ...adminUser };
      res.redirect("/products");
      return;
    }
    /*
    const user = await UsersModel.findOne({ email: email });
    if (user) {
      // Se verifica si el email y la contraseña son validos para iniciar sesión
      if (user.email !== email || !isValidPassword(password, user)) {
        return res.redirect("/login");
      }
    } else {
      return res.redirect("/login");
    }*/

    /*Todo esto comentado esta en desarrolo fede no me pegues*/
    next();
  },
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    try {
      req.session.user = {
        username: req.user.username,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      };
      req.session.login = true;
      res.redirect("/products");
    } catch (error) {
      res.status(500).send({ error: "Error in login" });
    }
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

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
  }
);

router.get("/current", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/login");
    } else {
      res.json(req.user);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
module.exports = router;
