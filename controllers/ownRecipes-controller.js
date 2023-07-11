const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, HttpError } = require("../helpers");

async function getOwn(req, res) {
  const { _id: owner } = req.user;
  const { page = 1, limit = 4 } = req.query;

  const skip = (page - 1) * limit;
  const [recipes, total] = await Promise.all([
    Recipe.find({ owner }, null, { skip, limit }).populate(
      "owner",
      "name email"
    ),
    Recipe.countDocuments({ owner }),
  ]);

  res.json({ recipes, total });
}

async function create(req, res) {
  const { body } = req;
  const { _id: owner } = req.user;

  const recipe = await Recipe.findOne({ title: body.title });

  if (recipe) {
    throw HttpError(400, "The name of the recipe in use");
  }

  const newRecipe = await Recipe.create({ ...body, owner });

  res.status(201).json(newRecipe);
}

async function deleteById(req, res) {
  const { id } = req.params;
  const response = await Recipe.findByIdAndRemove({ _id: id });

  if (!response) {
    throw HttpError(404, "The recipe not found");
  }

  res.json({ message: "The recipe deleted" });
}

module.exports = {
  getOwn: ctrlWrapper(getOwn),
  create: ctrlWrapper(create),
  deleteById: ctrlWrapper(deleteById),
};
