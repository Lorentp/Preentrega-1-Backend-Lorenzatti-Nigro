const mongoose = require("mongoose");

const cartsSchema = new mongoose.Schema({
  products: [
    {
      products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const CartsModel = mongoose.model("carts", cartsSchema);
module.exports = CartsModel;
