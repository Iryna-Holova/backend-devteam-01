const { Recipe } = require("../models/recipe-model");
const fs = require("fs/promises");
const { ctrlWrapper, HttpError, cloudinary } = require("../helpers");
const Jimp = require("jimp");

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
  const pages = Math.ceil(total / limit);

  res.json({ total, pages, recipes });
}

async function create(req, res) {
  const { body } = req;
  const { _id: owner } = req.user;
  const parsedRecipe = JSON.parse(body.recipe);
  const recipe = await Recipe.findOne({ title: parsedRecipe.title });

  if (recipe) {
    throw HttpError(400, "The name of the recipe in use");
  }

  if (req.file) {
    const { path: tempFilePath, mimetype } = req.file;

    if (!tempFilePath) {
      throw new HttpError(400, "No file uploaded");
    }

    const fileData = await cloudinary.uploader.upload(tempFilePath, {
      folder: "documents",
    });

    await fs.unlink(tempFilePath);

    const image = await Jimp.read(fileData.secure_url);
    image.resize(250, 250).quality(80);

    const processedRecipesPhotoPath = `temp/${parsedRecipe.title}_recipe.jpg`;
    await image.writeAsync(processedRecipesPhotoPath);

    const uniqueFilename = `${
      parsedRecipe.title
    }_${Date.now()}${mimetype.replace("image/", ".")}`;
    const recipePhotoPath = `public/documents/${uniqueFilename}`;
    await fs.rename(processedRecipesPhotoPath, recipePhotoPath);

    const newRecipe = await Recipe.create({
      ...parsedRecipe,
      owner,
      thumb: `/documents/${uniqueFilename}`,
    });

    res.status(201).json(newRecipe);
  } else {
    throw new HttpError(400, "No file uploaded");
  }
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
