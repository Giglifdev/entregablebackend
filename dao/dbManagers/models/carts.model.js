import mongoose from "mongoose";

const cartsCollection = "carts";

const productsCartsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    immutable: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    required: false,
    default: [],
  },
});

cartsSchema.pre(["find", "findById", "findOne"], function () {
  this.populate("products.product");
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
