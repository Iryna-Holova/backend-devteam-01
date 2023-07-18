const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, validationMessages } = require("../helpers");

const categories = [
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
  "Soup",
];

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [2, "Title must contain at least 2 characters"],
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: categories,
      required: [true, "Category is required"],
    },
    area: { type: String },
    instructions: { type: String, required: [true, "Instruction is required"] },
    description: { type: String, required: [true, "Description is required"] },
    thumb: { type: String },
    preview: { type: String },
    time: { type: String, required: [true, "Time is required"] },
    youtube: { type: String },
    tags: { type: [String] },
    ingredients: {
      type: [
        {
          _id: false,
          id: {
            type: String,
            required: [true, "Ingredient is required"],
            ref: "ingredient",
          },
          measure: { type: String, required: [true, "Measure is required"] },
        },
      ],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    favorite: {
      type: [
        {
          _id: false,
          _userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User's id is required"],
          },
        },
      ],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

recipeSchema.post("save", handleMongooseError);

const createOwnRecipeSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .empty()
    .trim()
    .label("title")
    .required()
    .messages(validationMessages),
  category: Joi.string()
    .valid(...categories)
    .empty()
    .required()
    .messages(validationMessages),
  area: Joi.string().empty().trim().messages(validationMessages),
  instructions: Joi.string()
    .empty()
    .trim()
    .required()
    .messages(validationMessages),
  description: Joi.string()
    .empty()
    .trim()
    .required()
    .messages(validationMessages),
  thumb: Joi.string().empty().trim().messages(validationMessages),
  preview: Joi.string().empty().trim().messages(validationMessages),
  time: Joi.string().empty().trim().required().messages(validationMessages),
  youtube: Joi.string().empty().trim().messages(validationMessages),
  tags: Joi.array()
    .items(Joi.string().empty().trim())
    .messages(validationMessages),
  ingredients: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.string()
          .hex()
          .length(24)
          .required()
          .messages(validationMessages),
        measure: Joi.string()
          .min(2)
          .max(24)
          .empty()
          .trim()
          .required()
          .messages(validationMessages),
      })
    )
    .required()
    .messages(validationMessages),
});
const Recipe = model("recipe", recipeSchema);

const limitMainPageSchema = Joi.object({
  limit: Joi.number().default(1).valid(1, 2, 4).messages(validationMessages),
});

const getByCategoryParamsSchema = Joi.object({
  category: Joi.string()
    .valid(...categories)
    .insensitive()
    .required()
    .messages(validationMessages),
});

const addFavoriteSchema = Joi.object({
  recipeId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(validationMessages),
});

const getValidateQueryShema = Joi.object({
  limit: Joi.number().min(1).messages(validationMessages),
  page: Joi.number().min(1).messages(validationMessages),
  q: Joi.string().messages(validationMessages),
});

const schemas = {
  limitMainPageSchema,
  createOwnRecipeSchema,
  getByCategoryParamsSchema,
  getValidateQueryShema,
  addFavoriteSchema,
};

module.exports = {
  Recipe,
  schemas,
};
