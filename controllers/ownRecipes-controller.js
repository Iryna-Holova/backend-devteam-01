const fs = require("fs/promises");
const { ctrlWrapper, HttpError, cloudinary } = require("../helpers");
const Jimp = require("jimp");
const { Recipe } = require("../models/recipe-model");
const { User } = require("../models/user-model");

async function getOwn(req, res) {
  const { _id: owner } = req.user;
  const { page = 1, limit = 4 } = req.query;

  const skip = (page - 1) * limit;
  const [{ value: recipes }, { value: total }] = await Promise.allSettled([
    Recipe.find({ owner }, null, { skip, limit })
      .sort({ createdAt: "desc" })
      .populate("owner", "name email"),
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
    const { path: tempFilePath, mimetype } = req.file;

    if (
      !["image/bmp", "image/jpeg", "image/png", "image/jpg"].includes(mimetype)
    ) {
      throw HttpError(400, "Format of the image must me JPEG, PNG or BMP");
    }

    if (!tempFilePath) {
      throw HttpError(400, "No file uploaded");
    }

    const [previewImage, thumbImage] = await Promise.allSettled([
      Jimp.read(tempFilePath),
      Jimp.read(tempFilePath),
    ]);

    const resizedPreviewImage = previewImage.value.cover(318, 324);
    const previewPhotoPath = `temp/${owner}_${Date.now()}.jpg`;

    const resizedThumbImage = thumbImage.value.cover(433, 332);
    const thumbPhotoPath = `temp/${owner}_${Date.now()}.jpg`;

    await Promise.allSettled([
      resizedPreviewImage.writeAsync(previewPhotoPath),
      resizedThumbImage.writeAsync(thumbPhotoPath),
    ]);

    const [previewFileData, thumbFileData] = await Promise.allSettled([
      cloudinary.uploader.upload(previewPhotoPath, {
        folder: "documents",
      }),
      cloudinary.uploader.upload(thumbPhotoPath, {
        folder: "documents",
      }),
    ]);

    const newRecipe = await Recipe.create({
      ...parsedRecipe,
      owner,
      preview: previewFileData.value.secure_url,
      thumb: thumbFileData.value.secure_url,
    });

    await Promise.allSettled([
      fs.unlink(tempFilePath, function (err) {
        if (err) console.log(err);
      }),
      fs.unlink(thumbPhotoPath, function (err) {
        if (err) console.log(err);
      }),
      fs.unlink(previewPhotoPath, function (err) {
        if (err) console.log(err);
      }),
    ]);

    res.status(201).json(newRecipe);
  } else {
    throw HttpError(400, "No file uploaded");
  }
}

async function deleteById(req, res) {
  const { id: recipeId } = req.params;
  const { _id: userId } = req.user;
  const response = await Recipe.findByIdAndRemove({ _id: recipeId });

  if (!response) {
    throw HttpError(404, "The recipe not found");
  }

  await User.findOneAndUpdate(
    {
      _id: userId,
      shoppingList: {
        $elemMatch: {
          measures: {
            $elemMatch: {
              recipeId: recipeId,
            },
          },
        },
      },
    },
    {
      $pull: {
        "shoppingList.$[].measures": {
          recipeId: recipeId,
        },
      },
    },
    {
      new: true,
    }
  );

  await User.findOneAndUpdate(
    {
      _id: userId,
      "shoppingList.measures": { $size: 0 },
    },
    {
      $pull: {
        shoppingList: {
          measures: { $size: 0 },
        },
      },
    },
    {
      new: true,
    }
  );

  res.json({ message: "The recipe deleted" });
}

module.exports = {
  getOwn: ctrlWrapper(getOwn),
  create: ctrlWrapper(create),
  deleteById: ctrlWrapper(deleteById),
};
