const User = require("../models/user");
const { Order } = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
      });
    }
    if (!user) {
      return res.status(400).json({
        error: "No user found with that Id",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //TODO: get back here for passwords
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Database error",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "name email purchases")
    .exec((err, order) => {
      if (err) {
        return res.status(500).json({
          error: "Database error",
        });
      }
      if (order.user.purchases.length() == 0) {
        return res.json({
          msg: "No purchases yet",
        });
      }
      res.json({
        user: order.user,
      });
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  const purchases = [];
  const { amount, transaction_id } = req.body.order;
  req.body.order.products.forEach((product) => {
    const { _id, name, description, category, quantity } = product;
    purchases.push({
      _id,
      name,
      description,
      category,
      quantity,
      amount,
      transaction_id,
    });
  });

  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases } },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(500).json({
          error: "Database error",
        });
      }
      next();
    }
  );
};
