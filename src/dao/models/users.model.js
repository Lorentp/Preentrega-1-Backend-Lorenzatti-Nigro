const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  cartId: {
    type: String,
  },
  role: {
    type: String,
  },
});
const UsersModel = mongoose.model("users", usersSchema);
module.exports = UsersModel;
