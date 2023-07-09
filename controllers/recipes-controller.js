const { ctrlWrapper, HttpError } = require('../helpers');
const { Recipe } = require('../models/recipe-model');

//
const getMainPage = async (req, res) => {
  const { limit = 1 } = req.body;
  const arrayOfMainPagePromises = [];
  arrayOfMainPagePromises.push(
    Recipe.find({ category: 'Breakfast' }, null, { limit }).sort({ name: 1 }).exec()
  );
  arrayOfMainPagePromises.push(
    Recipe.find({ category: 'Miscellaneous' }, null, { limit }).sort({ name: 1 }).exec()
  );
  arrayOfMainPagePromises.push(
    Recipe.find({ category: 'Chicken' }, null, { limit }).sort({ name: 1 }).exec()
  );
  arrayOfMainPagePromises.push(
    Recipe.find({ category: 'Desserts' }, null, { limit }).sort({ name: 1 }).exec()
  );

  Promise.all(arrayOfMainPagePromises).then(results => {
    const initialValue = {
      Breakfast: [],
      Miscellaneous: [],
      Chicken: [],
      Desserts: [],
    };

    const result = results
      .flatMap(item => {
        return [...item];
      })
      .reduce((queryResult, recipe) => {
        queryResult[recipe.category].push(recipe);

        return queryResult;
      }, initialValue);

    res.json(result);
  });
};

const getRecipesByCategory = async (req, res) => {
  const { category } = req.params;
  const { limit = 8 } = req.body;

  const response = await Recipe.find({ category }).sort({ _id: -1 }).limit(limit);
  //.populate('ingredients.id', 'name desc img');  uncomment if need or delete

  if (response.length > 0) res.json(response);
  else throw HttpError(404, `No recipes found in the ${category} category`);
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;

  const response = await Recipe.findById(id).populate('ingredients.id', 'name desc img');

  if (response) res.json(response);
  else throw HttpError(404, `No recipe found with id ${id} `);
};

module.exports = {
  getMainPage: ctrlWrapper(getMainPage),
  getRecipesByCategory: ctrlWrapper(getRecipesByCategory),
  getRecipeById: ctrlWrapper(getRecipeById),
};
