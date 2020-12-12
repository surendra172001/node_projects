const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0]["msg"],
      param: errors.array()[0]["param"],
    });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "User can't be saved in the DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/signin");
    }
    if (!user) {
      return res.status(401).send("user doesn't exists");
    }
    if (!user.authenticate(password)) {
      return res.status(401).send("Incorrect password");
    }

    // create a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("token", token, {
      maxAge: oneDay,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    const { _id, name, email, role } = user;

    res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ messasge: "User signout successfull" });
};

exports.isSignedIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN",
    });
  }
  next();
};
