const Ingredient = require("../models/indredients-model");
const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, upCaseFirstLetter } = require("../helpers");

async function getAll(req, res) {
  const result = await Ingredient.find({}).sort({ name: "asc" });

  res.json(result);
}

async function getByName(req, res) {

  const { query } = req.query;
  const name = upCaseFirstLetter(query);
  const ingredients = await Ingredient.find({
    name: { $regex: name, $options: "i" },
  });
  const ingredientsId = ingredients.map((ingredient) => ingredient.id);


  const recipes = await Recipe.find({
    ingredients: {
      $elemMatch: { id: { $in: ingredientsId } },
    },
  });
  res.json(recipes);
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getByName: ctrlWrapper(getByName),
};
