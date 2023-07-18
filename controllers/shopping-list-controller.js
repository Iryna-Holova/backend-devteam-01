const { User } = require("../models/user-model");
const { ctrlWrapper, HttpError } = require("../helpers");

async function getAll(req, res) {
  const { _id } = req.user;
  const { shoppingList } = await User.findById({ _id }).populate(
    "shoppingList.ingredientId"
  );

  res.json(shoppingList);
}

async function create(req, res) {
  const { _id: userId } = req.user;
  const { body } = req;

  const response = await User.findOne({
    _id: userId,
    shoppingList: { $elemMatch: { ingredientId: body.ingredientId } },
  });

  if (!response) {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          shoppingList: {
            ingredientId: body.ingredientId,
            measures: [
              {
                recipeId: body.recipeId,
                measure: body.measure,
              },
            ],
          },
        },
      },
      {
        new: true,
      }
    );

    res.json({ message: "The Ingredient added to shopping list" });
    return;
  }

  const isRecipeWithMeasure = await User.findOne({
    _id: userId,
    shoppingList: {
      $elemMatch: {
        ingredientId: body.ingredientId,
        measures: {
          $elemMatch: {
            recipeId: body.recipeId,
            measure: body.measure,
          },
        },
      },
    },
  });

  if (isRecipeWithMeasure) {
    throw HttpError(
      400,
      "The ingredient in a user's list from the recipe is already added"
    );
  }

  await User.updateOne(
    {
      _id: userId,
      shoppingList: {
        $elemMatch: {
          ingredientId: body.ingredientId,
        },
      },
    },
    {
      $push: {
        "shoppingList.$.measures": {
          recipeId: body.recipeId,
          measure: body.measure,
        },
      },
    }
  );

  res.json({ message: "The Ingredient added to shopping list" });
}

async function deleteById(req, res) {
  const { _id: userId } = req.user;
  const { body } = req;

  const response = await User.findOne({
    _id: userId,
    shoppingList: {
      $elemMatch: {
        ingredientId: body.ingredientId,
        measures: {
          $elemMatch: {
            recipeId: body.recipeId,
            measure: body.measure,
          },
        },
      },
    },
  });

  if (!response) {
    throw HttpError(404, "The ingredient in a user's list not found");
  }

  await User.updateOne(
    {
      _id: userId,
      shoppingList: {
        $elemMatch: {
          ingredientId: body.ingredientId,
        },
      },
    },
    {
      $pull: {
        "shoppingList.$.measures": {
          recipeId: body.recipeId,
          measure: body.measure,
        },
      },
    }
  );

  res.json({ message: "The ingredient deleted" });
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  create: ctrlWrapper(create),
  deleteById: ctrlWrapper(deleteById),
};
