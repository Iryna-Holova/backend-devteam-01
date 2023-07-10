const Ingredient = require("../models/indredients-model");
const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, upCaseFirstLetter } = require("../helpers");

async function getAll(req, res) {
  const result = await Ingredient.find({}).sort({ name: "asc" });

  res.json(result);
}

async function getByName(req, res) {
  const { q: ingredient } = req.query;
  const { page = 1, limit = 6 } = req.query;

	const skip = (page - 1) * limit;
  const name = upCaseFirstLetter(ingredient);
  const ingredients = await Ingredient.find({
    name: { $regex: name, $options: "i" },
	});

  const ingredientsId = ingredients.map((ingredient) => ingredient.id);
  const searchFilter = {
    ingredients: {
      $elemMatch: { id: { $in: ingredientsId } },
    },
  };

  const [recipes, totalCount] = await Promise.all([
    Recipe.find(searchFilter, null, { skip, limit }),
    Recipe.countDocuments(searchFilter),
  ]);

  res.json({ recipes, totalCount });
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getByName: ctrlWrapper(getByName),
};
