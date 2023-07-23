const { User } = require("../models/user-model");
const { ctrlWrapper, HttpError } = require("../helpers");
const { Recipe } = require("../models/recipe-model");
const Ingredient = require("../models/indredients-model");

async function getAll(req, res) {
  const { _id } = req.user;
  const { shoppingList } = await User.findById({ _id })
    .populate("shoppingList.ingredientId")
    .populate({
      path: "shoppingList.measures.recipeId",
      select: "title description thumb",
    });

  res.json(shoppingList);
}

async function create(req, res) {
  const { _id: userId } = req.user;
  const {
    body: { recipeId, ingredientId, measure },
  } = req;

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw HttpError(404, "The recipe not found");
  }

  const ingredient = await Ingredient.findById(ingredientId);

  if (!ingredient) {
    throw HttpError(404, "The ingredient not found");
  }

  const isIngredientInList = await User.findOne({
    _id: userId,
    shoppingList: { $elemMatch: { ingredientId } },
  });

  if (!isIngredientInList) {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          shoppingList: {
            ingredientId,
            measures: [
              {
                recipeId,
                measure,
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

  const isRecipeMeasureDoubled = await User.findOne({
    _id: userId,
    shoppingList: {
      $elemMatch: {
        ingredientId,
        measures: {
          $elemMatch: {
            recipeId,
            measure,
          },
        },
      },
    },
  });

  if (isRecipeMeasureDoubled) {
    throw HttpError(
      400,
      "The ingredient in a user's list from the recipe is already added"
    );
  }

  await User.findOneAndUpdate(
    {
      _id: userId,
      shoppingList: {
        $elemMatch: {
          ingredientId,
        },
      },
    },
    {
      $push: {
        "shoppingList.$.measures": {
          recipeId,
          measure,
        },
      },
    },
    {
      new: true,
    }
  );

  res.json({ message: "The Ingredient added to shopping list" });
}

async function deleteById(req, res) {
  const { _id: userId } = req.user;
  const {
    body: { ingredientId, recipeId, measure },
  } = req;

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: userId,
      shoppingList: {
        $elemMatch: {
          ingredientId: ingredientId,
          measures: {
            $elemMatch: {
              recipeId: recipeId,
              measure: measure,
            },
          },
        },
      },
    },
    {
      $pull: {
        "shoppingList.$.measures": {
          recipeId: recipeId,
          measure: measure,
        },
      },
    },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    throw HttpError(
      404,
      "The ingredient in a user's list is not found with such a measure"
    );
  }

  const [ingredientObject] = updatedUser.shoppingList.filter((shoppingList) => {
    if (shoppingList.ingredientId.toHexString() === ingredientId) {
      return shoppingList.measures;
    }
    return false;
  });

  if (ingredientObject.measures.length === 0) {
    await User.findOneAndUpdate(
      {
        _id: userId,
        shoppingList: {
          $elemMatch: {
            ingredientId: ingredientId,
          },
        },
      },
      {
        $pull: { shoppingList: { ingredientId: ingredientId } },
      },
      {
        new: true,
      }
    );
  }

  res.json({ message: "The ingredient deleted" });
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  create: ctrlWrapper(create),
  deleteById: ctrlWrapper(deleteById),
};
