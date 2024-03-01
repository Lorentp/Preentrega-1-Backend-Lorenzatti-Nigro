const passport = require("passport");
const local = require("passport-local");
const { createHash, isValidPassword } = require("../utils/hashBcrypt");
const UsersModel = require("../dao/models/users.model");
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let userExists = await UsersModel.findOne({ email });
          if (userExists) return done(null, false);
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "admin",
          };

          let result = await UsersModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const userExists = await UserModel.findOne({ email });
          if (!userExists) return done(null, false);
          if (!isValidPassword(password, userExists)) return done(null, false);
          return done(null, userExists);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UsersModel.findById({ _id: id });
    done(null, user);
  });
};

module.exports = initializePassport;
