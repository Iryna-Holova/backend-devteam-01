const { ctrlWrapper, HttpError } = require("../helpers");
const { Recipe } = require("../models/recipe-model");

//
const getMainPage = async (req, res) => {
  const { limit = 1 } = req.query;
  const arrayOfMainPagePromises = [];
  arrayOfMainPagePromises.push(
    Recipe.find({ category: "Breakfast" }).sort({ _id: -1 }).limit(limit)
  );
  arrayOfMainPagePromises.push(
    Recipe.find({ category: "Miscellaneous" }).sort({ _id: -1 }).limit(limit)
  );
  arrayOfMainPagePromises.push(
    Recipe.find({ category: "Chicken" }).sort({ _id: -1 }).limit(limit)
  );
  arrayOfMainPagePromises.push(
    Recipe.find({ category: "Dessert" }).sort({ _id: -1 }).limit(limit)
  );

  const [Breakfast, Miscellaneous, Chicken, Desserts] = await Promise.allSettled(
    arrayOfMainPagePromises
  );
  const result = {
    Breakfast: Breakfast.value,
    Miscellaneous: Miscellaneous.value,
    Chicken: Chicken.value,
    Desserts: Desserts.value,
  };

  res.json(result);
};

const getRecipesByCategory = async (req, res) => {
  const { category } = req.params;
  const { limit = 8, page = 1 } = req.query;

  const skip = limit * (page - 1);

  const query = category.trim();

  const response = await Recipe.find({ category: { $regex: query, $options: "i" } })
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
      ...response.ingredients.map(item => {
        const { id, img, name, desc } = item.id;
        const tmp = { id, name, desc, img, mesure: item.measure };

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
