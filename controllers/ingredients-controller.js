const Ingredients = require("../models/indredients-model");
const { ctrlWrapper } = require("../helpers");
const upCaseFirstLetter = require("../helpers/upCaseFirstLetter");
const Recipe = require("../models/recipe-model");

async function getAll(req, res) {
  const result = await Ingredients.find({}).sort({ name: "asc" });

  res.json(result);
}

async function getByName(req, res) {
  const { ingredients } = req.params;
  const name = upCaseFirstLetter(ingredients);
  const ingredient = await Ingredients.findOne({ name });

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
