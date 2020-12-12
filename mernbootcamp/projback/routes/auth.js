const express = require("express");
const router = express.Router();
const { signup, signin, signout, isSignedIn } = require("../controllers/auth");
const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("name")
      .isLength({ min: 3, max: 32 })
      .withMessage("Length must be less than 32"),
    body("password")
      .isLength({ min: 7 })
      .withMessage("password must of atleast length 7"),
    body("email").isEmail().withMessage("Incorrect email"),
  ],
  signup
);

router.post(
  "/signin",
  [
    body("password")
      .isLength({ min: 1 })
      .withMessage("password field is required"),
    body("email").isEmail().withMessage("Incorrect email"),
  ],
  signin
);

router.get("/signout", signout);

router.post("/test", isSignedIn, (req, res) => {
  res.send("holamola");
});

module.exports = router;
