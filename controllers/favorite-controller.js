const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, HttpError } = require("../helpers");
const { default: mongoose } = require("mongoose");

async function getAll(req, res) {
  const { _id } = req.user;
  const ObjectId = mongoose.Types.ObjectId;
  const favoriteRecipes = await Recipe.find({
    favorite: { $elemMatch: { userId: new ObjectId(_id) } },
  });

  res.json(favoriteRecipes);
}

async function save(req, res) {
  const { _id: userId } = req.user;
  const { recipeId } = req.body;

  const response = await Recipe.findByIdAndUpdate(
    recipeId,
    { $push: { favorite: { userId } } },
    {
      new: true,
    }
  );

  if (!response) {
    throw HttpError(404, "The recipe not found");
  }
  console.log(response);
  res.json(response);
}

async function deleteById(req, res) {
  const { _id: userId } = req.user;
  const { id: recipeId } = req.params;
  const response = await Recipe.findOne({
    recipeId,
    shoppingList: { $elemMatch: { userId } },
  });

  if (!response) {
    throw HttpError(404, "User's not found in the favorite");
  }

  await Recipe.findByIdAndUpdate(recipeId, {
    $pull: { favorite: { userId } },
  });

  res.json({ message: "The recipe deleted from favorite" });
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  save: ctrlWrapper(save),
  deleteById: ctrlWrapper(deleteById),
};
