import { cartsModel } from "./models/carts.model.js";

export default class Carts {
  constructor() {}

  getAll = async () => {
    const carts = await cartsModel.find().lean();
    return carts;
  };

  getById = async (id) => {
    const cart = await cartsModel.findById({ _id: id }).lean();
    return cart;
  };

  create = async () => {
    const result = await cartsModel.create({});
    return result;
  };

  addProduct = async (cid, pid) => {
    const cart = await cartsModel.findById({ _id: cid });

    if (!cart) return null;

    if (cart?.products?.length > 0) {
      const productIndex = cart.products?.findIndex(
        (prod) => prod.product["_id"] == pid
      );

      if (productIndex === -1) {
        cart.products?.push({ product: pid, quantity: 1 });
      } else {
        cart.products[productIndex].quantity =
          cart.products[productIndex].quantity + 1;
      }
    } else {
      cart.products?.push({ product: pid, quantity: 1 });
    }
    const result = await cartsModel.updateOne({ _id: cid }, cart);
    const updated = await cartsModel.findById({ _id: cid });
    return updated;
  };

  deleteProductCart = async (cid, pid) => {
    const cart = await cartsModel.findById({ _id: cid });
    if (cart?.products?.length === 0) {
      throw new Error("Not Found: There are no products in the cart");
    } else {
      const productIndex = cart.products?.findIndex(
        (prod) => prod.product["_id"] == pid
      );
      if (productIndex === -1)
        throw new Error("Product not found in this cart");
      const result = await cartsModel.updateOne(
        { _id: cid },
        { $pull: { products: { product: { _id: pid } } } }
      );
      const cartUpdated = await cartsModel.findById({ _id: cid });
      return cartUpdated;
    }
  };

  deleteProducts = async (cid) => {
    const cart = await cartsModel.findById({ _id: cid });
    if (cart?.products?.length === 0) {
      throw new Error("Not Found: There are no products in the cart");
    } else {
      const result = await cartsModel.updateOne(
        { _id: cid },
        { $set: { products: [] } }
      );
      const cartUpdated = await cartsModel.findById({ _id: cid });
      return cartUpdated;
    }
  };

  updateQuantityProduct = async (cid, pid, quantity) => {
    const cart = await cartsModel.findById({ _id: cid });
    if (cart?.products?.length === 0) {
      throw new Error("Not Found: There are no products in the cart");
    } else {
      const productIndex = cart.products?.findIndex(
        (prod) => prod.product["_id"] == pid
      );
      if (productIndex === -1)
        throw new Error("Product not found in this cart");
      const result = await cartsModel.updateOne(
        { $and: [{ _id: cid }, { products: { product: { _id: pid } } }] },
        { $inc: { products: { product: { _id: { quantity: quantity } } } } }
      );
      const cartUpdated = await cartsModel.findOne({
        $and: [{ _id: cid }, { "products.product": pid }],
      });
      return cartUpdated;
    }
  };

  updateCart = async (cid, products) => {
    const result = await cartsModel.updateOne(
      { _id: cid },
      { $set: { products: products } }
    );
    const cartUpdated = await cartsModel.findById({ _id: cid });
    return cartUpdated;
  };
}
