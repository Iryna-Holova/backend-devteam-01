const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, HttpError } = require("../helpers");
const { default: mongoose } = require("mongoose");

async function getAll(req, res) {
  const { _id } = req.user;
  const ObjectId = mongoose.Types.ObjectId;
  const favoriteRecipes = await Recipe.find({
    favorite: { $elemMatch: {} },
  });

  res.json(favoriteRecipes);
}

async function save(req, res) {
  const { _id } = req.user;
  const { recipeId } = req.body;

  const response = await Recipe.findByIdAndUpdate(
    recipeId,
    { $push: { favorite: { _id } } },
    {
      new: true,
    }
  );

  res.json(response);
}

// async function deleteById(req, res) {
//   const { _id } = req.user;
//   const { id: ingredientId } = req.params;
//   const response = await User.findOne({
//     _id,
//     shoppingList: { $elemMatch: { ingredientId } },
//   });

//   if (!response) {
//     throw HttpError(404, "The ingredient in a user's list not found");
//   }

//   await User.findByIdAndUpdate(_id, {
//     $pull: { shoppingList: { ingredientId } },
//   });

//   res.json({ message: "The ingredient deleted" });
// }

module.exports = {
  getAll: ctrlWrapper(getAll),
  save: ctrlWrapper(save),
  // deleteById: ctrlWrapper(deleteById),
};
