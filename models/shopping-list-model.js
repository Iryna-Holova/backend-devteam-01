const { Schema } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

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
  ingredientId: Joi.string().hex().length(24).required(),
  recipeId: Joi.string().hex().length(24).required(),
  measure: Joi.array().items(Joi.string()).required(),
});

const shoppingListSchemas = {
  createSchema,
};

module.exports = {
  ShoppingListSchema,
  shoppingListSchemas,
};
