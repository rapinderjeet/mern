import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products", error);
    res
      .status(500)
      .send({ success: false, message: "Error fetching products" });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;
  if (!product || !product.name || !product.price || !product.image) {
    res
      .status(400)
      .send({ success: false, message: "All fields are required" });
  }

  const newProduct = new Product(product);
  try {
    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error saving product", error);
    res.status(500).send({ success: false, message: "Error saving product" });
  }
};

export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = req.body;
  if (!productId || !product) {
    res
      .status(400)
      .send({ success: false, message: "Product ID and data are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).send({ success: false, message: "Invalid Product ID" });
  }

  try {
    const updated = await Product.findByIdAndUpdate(productId, product, {
      new: true,
    });
    if (updated) {
      res.status(200).send({ success: true, data: updated });
    } else {
      res.status(404).send({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product", error);
    res.status(404).send({ success: false, message: "Product not found" });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).send({ success: false, message: "Product ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).send({ success: false, message: "Invalid Product ID" });
  }

  try {
    const deleted = await Product.findByIdAndDelete(productId);
    if (deleted) {
      res.status(200).send({ success: true, message: "Product deleted" });
    } else {
      res.status(404).send({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};
