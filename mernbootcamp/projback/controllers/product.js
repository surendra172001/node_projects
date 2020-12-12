const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
// const { validationResult } = require("express-validator");

exports.getProductById = (req, res, next, Id) => {
  Product.findById(Id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(500).json({
          error: "Database Error",
        });
      }
      if (!product) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  // This will keep the file extension like .png, .jpg, .pdf
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error with the Image" });
    }

    // checking for errors
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please enter valid fields",
      });
    }

    const product = new Product(fields);

    // Handle file
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    // saving file
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Not abe to save the image",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Unsuccessful deletion",
      });
    }
    res.json({
      msg: `successfully deleted ${deletedProduct.name}`,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  // This will keep the file extension like .png, .jpg, .pdf
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error with the Image" });
    }

    const product = _.extend(req.product, fields);

    // Handle file
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    // saving file
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product unsuccessfull",
        });
      }
      res.json(product);
    });
  });
};

// product listing
exports.getAllProducts = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.json({
          error: "No products found",
        });
      }
      res.json(products);
    });
};
