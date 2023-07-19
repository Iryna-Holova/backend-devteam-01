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

  if (req.file) {
    const { path: tempFilePath } = req.file;

    if (!tempFilePath) {
      throw new HttpError(400, "No file uploaded");
    }

    const previewImage = await Jimp.read(tempFilePath);
    const resizedPreviewImage = previewImage.resize(318, 324).quality(80);
    const previewPhotoPath = `temp/${owner}_${Date.now()}.jpg`;
    await resizedPreviewImage.writeAsync(previewPhotoPath);

    const previewFileData = await cloudinary.uploader.upload(previewPhotoPath, {
      folder: "documents",
    });

    const thumbImage = await Jimp.read(tempFilePath);
    const resizedThumbImage = thumbImage.resize(433, 332).quality(80);
    const thumbPhotoPath = `temp/${owner}_${Date.now()}.jpg`;
    await resizedThumbImage.writeAsync(thumbPhotoPath);

    const thumbFileData = await cloudinary.uploader.upload(thumbPhotoPath, {
      folder: "documents",
    });

    const newRecipe = await Recipe.create({
      ...parsedRecipe,
      owner,
      preview: previewFileData.secure_url,
      thumb: thumbFileData.secure_url,
    });

    await fs.unlink(tempFilePath);
    await fs.unlink(thumbPhotoPath);
    await fs.unlink(previewPhotoPath);

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
