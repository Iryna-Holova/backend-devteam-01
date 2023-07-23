const { ctrlWrapper } = require("../helpers");
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

  const [Breakfast, Miscellaneous, Chicken, Desserts] =
    await Promise.allSettled(arrayOfMainPagePromises);
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
  const searchFilter = {
    category: { $regex: query, $options: "i" },
  };
  const [{ value: response }, { value: total }] = await Promise.allSettled([
    Recipe.find(searchFilter).sort({ _id: -1 }).skip(skip).limit(limit),
    Recipe.countDocuments(searchFilter),
  ]);

  const pages = Math.ceil(total / limit);
  const result = { total, pages, recipes: [...response] };

  res.json(result);
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;

  const response = await Recipe.findById(id).populate("ingredients.id");

  const obj = { ...response._doc };
  obj.ingredients = [
    ...response.ingredients.map((item) => {
      const { id, img, name, desc } = item.id;
      const tmp = { id, name, desc, img, mesure: item.measure };

      return tmp;
    }),
  ];

  res.json(obj);
};

const getSearchByName = async (req, res) => {
  const { limit = 6, q = "", page = 1 } = req.query;
  const skip = limit * (page - 1);

  const title = q.trim();
  const searchFilter = {
    title: { $regex: title, $options: "i" },
  };
  const [{ value: response }, { value: total }] = await Promise.allSettled([
    Recipe.find(searchFilter).sort({ _id: -1 }).skip(skip).limit(limit),
    Recipe.countDocuments(searchFilter),
  ]);

  const pages = Math.ceil(total / limit);
  const result = { total, pages, recipes: [...response] };

  res.json(result);
};

module.exports = {
  getMainPage: ctrlWrapper(getMainPage),
  getRecipesByCategory: ctrlWrapper(getRecipesByCategory),
  getRecipeById: ctrlWrapper(getRecipeById),
  getSearchByName: ctrlWrapper(getSearchByName),
};
