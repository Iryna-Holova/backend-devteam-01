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
  recipeId: {
    type: Schema.Types.ObjectId,
    required: [true, "The recipe's id is required"],
    ref: "recipe",
  },
  measure: {
    type: [String],
    required: [true, "The measure is required"],
    default: [],
  },
});

ShoppingListSchema.post("save", handleMongooseError);

const createSchema = Joi.object({
  ingredientId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(validationMessage({ name: "ingredientId" })),
  recipeId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(validationMessage({ name: "recipeId" })),
  measure: Joi.array()
    .min(1)
    .items(
      Joi.string()
        .empty(false)
        .trim()
        .messages(validationMessage({ name: "measure item" }))
    )
    .required()
    .messages(validationMessage({ name: "measure" })),
});

const shoppingListSchemas = {
  createSchema,
};

module.exports = {
  ShoppingListSchema,
  shoppingListSchemas,
};
