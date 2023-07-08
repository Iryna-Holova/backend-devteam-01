const { Recipe } = require("../models/recipe-model");
const { ctrlWrapper } = require("../helpers");

async function getOwn(req, res) {
  // const { _id: owner } = req.user;
  // const recipe = await Recipe.find({ owner }).populate("owner", "name email");
  const recipe = await Recipe.find();

  res.status(201).json(recipe);
}

async function create(req, res) {
  const { body } = req;
  // const { _id: owner } = req.user;
  // const recipe = await Recipe.create({ ...body, owner });
  const recipe = await Recipe.create({ ...body });

  res.status(201).json(recipe);
}

async function deleteById(req, res) {
  const { id } = req.params;
  console.log(id);
  await Recipe.findByIdAndRemove(id);

  res.status(204).end();
}

module.exports = {
  getOwn: ctrlWrapper(getOwn),
  create: ctrlWrapper(create),
  deleteById: ctrlWrapper(deleteById),
};
