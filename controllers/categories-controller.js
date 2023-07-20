const Category = require("../models/category-model");

const { ctrlWrapper } = require("../helpers");

const getAllCategories = async (req, res) => {
  const result = await Category.find().sort({ name: "asc" });
  res.json(result);
};

module.exports = {
  getAllCategories: ctrlWrapper(getAllCategories),
};
