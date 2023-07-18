const { Schema } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, validationMessage } = require("../helpers");

const ShoppingListSchema = new Schema({
  _id: false,
  ingredientId: {
    type: Schema.Types.ObjectId,
    required: [true, "The ingredient's id is required"],
    ref: "ingredient",
  },
  measures: {
    _id: false,
    type: [
      {
        recipeId: {
          type: Schema.Types.ObjectId,
          required: [true, "The recipe's id is required"],
          ref: "recipe",
        },
        measure: {
          type: String,
          required: [true, "The measure is required"],
        },
      },
    ],
    required: [true, "The array of ingredients is required"],
  },
});

ShoppingListSchema.post("save", handleMongooseError);

const createSchema = Joi.object({
  ingredientId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(validationMessage({ name: "IngredientId", length: 24 })),
  recipeId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(validationMessage({ name: "RecipeId", length: 24 })),
  measure: Joi.string()
    .empty()
    .min(2)
    .max(24)
    .trim()
    .messages(validationMessage({ name: "Measure", maxStr: 24 })),
});

const shoppingListSchemas = {
  createSchema,
};

module.exports = {
  ShoppingListSchema,
  shoppingListSchemas,
};
