const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper, HttpError } = require("../helpers");

async function getOwn(req, res) {
  const { _id: owner } = req.user;
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;

  const recipe = await Recipe.find({ owner }, null, { skip, limit }).populate(
    "owner",
    "name email"
  );

  res.json(recipe);
}

async function create(req, res) {
  const { body } = req;
  const { _id: owner } = req.user;

  const recipe = await Recipe.create({ ...body, owner });

  res.status(201).json(recipe);
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
