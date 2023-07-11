const { ctrlWrapper, HttpError } = require("../helpers");
const { Recipe } = require("../models/recipe-model");

//
const getMainPage = async (req, res) => {
  const { limit = 1 } = req.query;
  const arrayOfMainPagePromises = [];
  arrayOfMainPagePromises.push(
    //    Recipe.find({ category: 'Breakfast' }, null, { limit }).sort({ name: 1 }).exec()
    Recipe.find({ category: "Breakfast" }).sort({ _id: -1 }).limit(limit)
  );
  arrayOfMainPagePromises.push(
    // Recipe.find({ category: 'Miscellaneous' }, null, { limit }).sort({ name: 1 }).exec()
    Recipe.find({ category: "Miscellaneous" }).sort({ _id: -1 }).limit(limit)
  );
  arrayOfMainPagePromises.push(
    //  Recipe.find({ category: 'Chicken' }, null, { limit }).sort({ name: 1 }).exec()
    Recipe.find({ category: "Chicken" }).sort({ _id: -1 }).limit(limit)
  );
  arrayOfMainPagePromises.push(
    //  Recipe.find({ category: 'Desserts' }, null, { limit }).sort({ name: 1 }).exec()
    Recipe.find({ category: "Dessert" }).sort({ _id: -1 }).limit(limit)
  );

  const [Brekfast, Miscellaneous, Chicken, Desserts] = await Promise.allSettled(
    arrayOfMainPagePromises
  );
  const result = {
    Brekfast: Brekfast.value,
    Miscellaneous: Miscellaneous.value,
    Chicken: Chicken.value,
    Desserts: Desserts.value,
  };

  // Promise.all(arrayOfMainPagePromises).then(results => {
  //   const initialValue = {
  //     Breakfast: [],
  //     Miscellaneous: [],
  //     Chicken: [],
  //     Desserts: [],
  //   };

  //   const result = results
  //     .flatMap(item => {
  //       return [...item];
  //     })
  //     .reduce((queryResult, recipe) => {
  //       queryResult[recipe.category].push(recipe);

  //       return queryResult;
  //     }, initialValue);

  //   res.json(result);
  // });
  res.json(result);
};

const getRecipesByCategory = async (req, res) => {
  const { category } = req.params;
  const { limit = 8, page = 1 } = req.query;

  const skip = limit * (page - 1);

  const response = await Recipe.find({ category })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  if (response.length > 0) {
    const total = await Recipe.where({ category }).countDocuments();

    const pages = Math.ceil(total / limit);
    const result = { total, pages, recipes: [...response] };

    res.json(result);
  } else throw HttpError(404, `No recipes found in the ${category} category`);
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;

  const response = await Recipe.findById(id).populate("ingredients.id");

  if (response) {
    const obj = { ...response._doc };
    obj.ingredients = [
      ...response.ingredients.map((item) => {
        const { id, img, name, desc } = item.id;
        //const { _id, img, name, desc } = item.id;
        const tmp = { id, name, desc, img, mesure: item.measure };
        //const tmp = { _id, name, desc, img, mesure: item.measure };

        return tmp;
      }),
    ];

    res.json(obj);
  } else throw HttpError(404, `No recipe found with id ${id} `);
};

const getSearchByName = async (req, res) => {
  const { limit = 6, q = "", page = 1 } = req.query;
  const skip = limit * (page - 1);

  const title = q.trim();

  const response = await Recipe.find({
    title: { $regex: title, $options: "i" },
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  if (response.length > 0) {
    const total = await Recipe.where({
      title: { $regex: title, $options: "i" },
    }).countDocuments();

    const pages = Math.ceil(total / limit);
    const result = { total, pages, recipes: [...response] };

    res.json(result);
  } else throw HttpError(404, `No recipes found this ${q} in title`);
};

module.exports = {
  getMainPage: ctrlWrapper(getMainPage),
  getRecipesByCategory: ctrlWrapper(getRecipesByCategory),
  getRecipeById: ctrlWrapper(getRecipeById),
  getSearchByName: ctrlWrapper(getSearchByName),
};
