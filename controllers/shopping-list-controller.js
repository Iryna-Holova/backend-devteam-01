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
    throw HttpError(400, "The ingredient in a user's list from the recipe is already added");
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
    throw HttpError(404, "The ingredient is not found with such a measure in the user's list");
  }

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

  res.json({ message: "The ingredient deleted" });
}

async function addAllInRecipe(req, res) {
  const { _id: userId } = req.user;
  const { id: recipeId } = req.params;

  const { ingredients } = await Recipe.findById(recipeId, "ingredients");
  const { shoppingList } = await User.findById(userId);

  //console.log(ingredients);

  // Проверяем наличие ингредиентов в shoppingList в списке ингредиентов рецепта. Если есть, проверяем наличие рецепта в measures.
  // Если нет, добавляем и удаляем из списка ингредиентов.
  const shoppingListNew = shoppingList.reduce((shoppingList, current) => {
    const index = ingredients.findIndex(
      ingredient => ingredient.id === current.ingredientId.toString()
    );
    //console.log(index);
    if (index < 0) return [...shoppingList, current];
    else {
      //console.log(recipeId, current.measures);
      const recipeIndex = current.measures.findIndex(
        measure => measure.recipeId.toString() === recipeId
      );
      if (recipeIndex < 0) {
        current.measures.push({ recipeId, measure: ingredients[index].measure });
      }
      ingredients.splice(index, 1);
      return [...shoppingList, current];
    }
  }, []);

  //Добавляем оставшиеся ингредиенты в shoppingList
  if (ingredients.length > 0)
    ingredients.forEach(ingredient => {
      shoppingListNew.push({
        ingredientId: ingredient.id,
        measures: [{ recipeId, measure: ingredient.measure }],
      });
    });

  await User.findOneAndUpdate(
    { _id: userId },
    { shoppingList: [...shoppingListNew] },
    {
      new: true,
    }
  );

  res.json(shoppingListNew);
}

async function delAllInRecipe(req, res) {
  console.log(req.params);
  res.json(req.params);
}

async function clear(req, res) {
  const { _id: userId } = req.user;

  await User.findOneAndUpdate(
    { _id: userId },
    { shoppingList: [] },
    {
      new: true,
    }
  );

  res.json({ message: "Shopping list cleared" });
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  create: ctrlWrapper(create),
  deleteById: ctrlWrapper(deleteById),
  addAllInRecipe: ctrlWrapper(addAllInRecipe),
  delAllInRecipe: ctrlWrapper(delAllInRecipe),
  clear: ctrlWrapper(clear),
};
