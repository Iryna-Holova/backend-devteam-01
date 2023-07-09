const { User } = require("../models/user-model");
const { ctrlWrapper, HttpError } = require("../helpers");

async function getAll(req, res) {
  const { _id } = req.user;
  const shoppingList = await User.findById({ _id }).populate(
    "shoppingList.ingredientId"
  );

  res.json(shoppingList);
}

async function create(req, res) {
  const { _id } = req.user;
  const { body } = req;

  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { shoppingList: { ...body } } },
    {
      new: true,
    }
  );

  res.json(response);
}

async function deleteById(req, res) {
  const { _id } = req.user;
  const { id: ingredientId } = req.params;
  const response = await User.findOne({
    _id,
    shoppingList: { $elemMatch: { ingredientId } },
  });

  if (!response) {
    throw HttpError(404, "The ingredient in a user's list not found");
  }

  await User.findByIdAndUpdate(_id, {
    $pull: { shoppingList: { ingredientId } },
  });

  res.json({ message: "The ingredient deleted" });
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  create: ctrlWrapper(create),
  deleteById: ctrlWrapper(deleteById),
};
