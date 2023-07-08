const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const recipeSchema = new Schema({
  title: String,
  category: String,
  area: String,
  instructions: String,
  description: String,
  thumb: String,
  preview: String,
  time: String,
  youtube: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  tags: [String],
  ingredients: [
    {
      id: { type: String, ref: "ingredient" },
      measure: String,
    },
  ],
});

recipeSchema.post("save", handleMongooseError);

const createSchema = Joi.object().keys({
  title: Joi.string().required(),
  category: Joi.valid(
    "Seafood",
    "Lamb",
    "Starter",
    "Chicken",
    "Beef",
    "Dessert",
    "Vegan",
    "Pork",
    "Vegetarian",
    "Miscellaneous",
    "Pasta",
    "Breakfast",
    "Side",
    "Goat",
    "Soup"
  ).required(),
  area: Joi.string().required(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  thumb: Joi.string().required(),
  preview: Joi.string().required(),
  time: Joi.string().required(),
  youtube: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        measure: Joi.string().required(),
      })
    )
    .required(),
});

const Recipe = model("recipe", recipeSchema);

const ownRecipeSchemas = {
  createSchema,
};

module.exports = {
  Recipe,
  ownRecipeSchemas,
};
