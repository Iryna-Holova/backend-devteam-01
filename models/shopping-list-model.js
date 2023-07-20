const { Schema } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, validationMessages } = require("../helpers");

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
    .messages(validationMessages),
  recipeId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(validationMessages),
  measure: Joi.string()
    .empty()
    .min(1)
    .trim()
    .messages(validationMessages),
});

const shoppingListSchemas = {
  createSchema,
};

module.exports = {
  ShoppingListSchema,
  shoppingListSchemas,
};
