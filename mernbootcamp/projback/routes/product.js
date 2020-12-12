const express = require("express");
const router = express.Router();
// const { body } = require("express-validator");

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// all the params
router.param("userId", getUserById);
router.param("productId", getProductById);

// routes
// post routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// get routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.get("/products", getAllProducts);

// delete routes
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// update routes
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

module.exports = router;

// [
//   body("name", "please provide valid name").exists({
//     checkNull: true,
//     checkFalsy: true,
//   }),
//   body("description", "please provide valid description").exists({
//     checkNull: true,
//     checkFalsy: true,
//   }),
//   body("price", "please provide valid price").exists({
//     checkNull: true,
//     checkFalsy: true,
//   }),
//   body("category", "please provide valid category").exists({
//     checkNull: true,
//     checkFalsy: true,
//   }),
//   body("stock", "please provide valid stock").exists({
//     checkNull: true,
//     checkFalsy: true,
//   }),
// ],

// const errors = validationResult(req);
// if (!errors.isEmpty()) {
//   return res.status(400).json({ errors: errors.array() });
// }
