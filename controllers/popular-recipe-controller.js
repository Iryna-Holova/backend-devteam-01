const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper } = require("../helpers");

async function getAll(req, res) {
  const recipes = await Recipe.aggregate([
    { $sort: { favorite: -1 } },
    {
      $limit: 4,
    },
  ]);

  res.json(recipes);
}

module.exports = {
  getAll: ctrlWrapper(getAll),
};
