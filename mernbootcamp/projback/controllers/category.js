const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id, (err, category) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
      });
    }
    if (!category) {
      return res.status(400).json({
        error: "No category found with that Id",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      res.status(400).json({
        error: "Category was not saved in DB",
      });
    }
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, items) => {
    if (err) {
      return res.json({ error: "Internal Database error" });
    }
    if (!items) {
      return res.json({ error: "No item found" });
    }
    res.json(items);
  });
};

exports.updateCategory = (req, res) => {
  // This category is a mongoose object creating from the template of mongoose schema
  const category = req.category;
  category.name = req.body.name;

  // Since it is mongoose obj we can call save function on this object
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        msg: "Updation failed",
      });
    }

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.json({ error: "Deletion failed" });
    }
    res.json({
      msg: `${category.name} deleted successfully`,
    });
  });
};
