const Category = require('../models/category-model');

const { ctrlWrapper } = require('../helpers');

const getAllCategories = async (req, res) => {
  const result = await Category.find().sort({ name: 1 });
  res.json(result);
};

module.exports = {
  getAllCategories: ctrlWrapper(getAllCategories),
};
