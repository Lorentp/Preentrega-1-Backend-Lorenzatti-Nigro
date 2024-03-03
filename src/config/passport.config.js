const passport = require("passport");
const local = require("passport-local");
const { createHash, isValidPassword } = require("../utils/hashBcrypt");
const UsersModel = require("../dao/models/users.model");
const LocalStrategy = local.Strategy;
const GitHubStrategy = require("passport-github2");

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
            role: "usuario",
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
          const userExists = await UsersModel.findOne({ email });
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

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.2de541224b6575ba",
        clientSecret: "d651b577563d0e60ce674d8a782aa4d82e37530f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UsersModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: "",
              password: "",
              role: "usuario",
            };
            let result = await UsersModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
