const Ingredient = require("../models/indredients-model");
const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, upCaseFirstLetter } = require("../helpers");

async function getAll(req, res) {
  const result = await Ingredient.find({}).sort({ name: "asc" });

  res.json(result);
}

async function getByName(req, res) {
  const { ingredients } = req.params;
  const name = upCaseFirstLetter(ingredients);
  const ingredient = await Ingredient.findOne({ name });

  const recipes = await Recipe.find({
    ingredients: {
      $elemMatch: { id: ingredient._id.toHexString() },
    },
  });
  res.json(recipes);
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getByName: ctrlWrapper(getByName),
};
