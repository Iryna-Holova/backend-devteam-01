const { ctrlWrapper } = require('../helpers');
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
    const initialValue = { Breakfast: [], Miscellaneous: [], Chicken: [], Desserts: [] };

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

module.exports = {
  getMainPage: ctrlWrapper(getMainPage),
};
