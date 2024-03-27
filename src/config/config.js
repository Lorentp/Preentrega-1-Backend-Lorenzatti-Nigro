const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const { mode } = program.opts();

dotenv.config({
  path: mode === "production" ? "./.env.production" : "./.env.development",
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  port: process.env.PORT,
};

module.exports = configObject;
