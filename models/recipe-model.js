const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError, validationMessage } = require("../helpers");

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
    .required()
    .messages(validationMessage({ name: "Title", minStr: 2 })),
  category: Joi.string()
    .valid(...categories)
    .empty()
    .required()
    .messages(validationMessage({ name: "Category", valid: categories })),
  area: Joi.string()
    .empty()
    .trim()
    .messages(validationMessage({ name: "Area" })),
  instructions: Joi.string()
    .empty()
    .trim()
    .required()
    .messages(validationMessage({ name: "Instructions" })),
  description: Joi.string()
    .empty()
    .trim()
    .required()
    .messages(validationMessage({ name: "Description" })),
  thumb: Joi.string()
    .empty()
    .trim()
    .messages(validationMessage({ name: "Thumb" })),
  preview: Joi.string()
    .empty()
    .trim()
    .messages(validationMessage({ name: "Preview" })),
  time: Joi.string()
    .empty()
    .trim()
    .required()
    .messages(validationMessage({ name: "Time" })),
  youtube: Joi.string()
    .empty()
    .trim()
    .messages(validationMessage({ name: "Youtube" })),
  tags: Joi.array()
    .items(Joi.string().empty().trim())
    .messages(validationMessage({ name: "Tags" })),
  ingredients: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.string()
          .hex()
          .length(24)
          .required()
          .messages(validationMessage({ name: "Ingredient's id", length: 24 })),
        measure: Joi.string()
          .min(2)
          .max(24)
          .empty()
          .trim()
          .required()
          .messages(
            validationMessage({ name: "Measure", maxStr: 24, minStr: 2 })
          ),
      })
    )
    .required()
    .messages(validationMessage({ name: "Ingredients", minArr: 1 })),
});

const Recipe = model("recipe", recipeSchema);

const limitMainPageSchema = Joi.object({
  limit: Joi.number()
    .default(1)
    .valid(1, 2, 4)
    .messages(validationMessage({ name: "Limit", valid: [1, 2, 4] })),
});

const getByCategoryParamsSchema = Joi.object({
  category: Joi.string()
    .valid(...categories)
    .insensitive()
    .required()
    .messages(
      validationMessage({ name: "Category as param", valid: categories })
    ),
});

const addFavoriteSchema = Joi.object({
  recipeId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(validationMessage({ name: "RecipeId", length: 24 })),
});

const getValidateQueryShema = Joi.object({
  limit: Joi.number()
    .min(1)
    .messages(validationMessage({ name: "'q' query", minNum: 1 })),
  page: Joi.number()
    .min(1)
    .messages(validationMessage({ name: "'q' query", minNum: 1 })),
  q: Joi.string().messages(validationMessage({ name: "'q' query" })),
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
