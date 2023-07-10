const Ingredient = require("../models/indredients-model");
const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, upCaseFirstLetter } = require("../helpers");

async function getAll(req, res) {
  const result = await Ingredient.find({}).sort({ name: "asc" });

  res.json(result);
}

async function getByName(req, res) {
  const { query } = req.query;
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;

	const name = upCaseFirstLetter(query);
  const ingredients = await Ingredient.find({
    name: { $regex: name, $options: "i" },
  });
  const ingredientsId = ingredients.map((ingredient) => ingredient.id);

  const recipes = await Recipe.find(
    {
      ingredients: {
        $elemMatch: { id: { $in: ingredientsId } },
      },
    },
    null,
    { skip, limit }
  );

  res.json(recipes);
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getByName: ctrlWrapper(getByName),
};
