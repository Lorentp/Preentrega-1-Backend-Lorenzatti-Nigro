const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const MessageModel = mongoose.model("messages", messagesSchema);
module.exports = MessageModel;
