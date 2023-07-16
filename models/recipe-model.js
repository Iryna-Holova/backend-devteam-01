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
    .empty(false)
    .trim()
    .required()
    .messages(validationMessage({ name: "title" })),
  category: Joi.valid(...categories)
    .required()
    .empty(false)
    .messages(validationMessage({ name: "category" })),
  area: Joi.string()
    .empty(false)
    .trim()
    .messages(validationMessage({ name: "area" })),
  instructions: Joi.string()
    .empty(false)
    .trim()
    .required()
    .messages(validationMessage({ name: "instructions" })),
  description: Joi.string()
    .empty(false)
    .trim()
    .required()
    .messages(validationMessage({ name: "description" })),
  thumb: Joi.string()
    .empty(false)
    .trim()
    .messages(validationMessage({ name: "thumb" })),
  preview: Joi.string()
    .empty(false)
    .trim()
    .messages(validationMessage({ name: "preview" })),
  time: Joi.string()
    .empty(false)
    .trim()
    .required()
    .messages(validationMessage({ name: "time" })),
  youtube: Joi.string()
    .empty(false)
    .trim()
    .messages(validationMessage({ name: "youtube" })),
  tags: Joi.array()
    .items(Joi.string().empty(false).trim())
    .messages(validationMessage({ name: "tags" })),
  ingredients: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.string()
          .hex()
          .length(24)
          .required()
          .messages(validationMessage({ name: "ingredient's id" })),
        measure: Joi.string()
          .required()
          .empty(false)
          .trim()
          .messages(validationMessage({ name: "measure" })),
      })
    )
    .required()
    .messages(validationMessage({ name: "ingredients" })),
});

const Recipe = model("recipe", recipeSchema);

const limitMainPageSchema = Joi.object({
  limit: Joi.number().default(1).valid(1, 2, 4),
});

const getByCategoryParamsSchema = Joi.object({
  category: Joi.string()
    .valid(...categories)
    .insensitive()
    .required(),
});

const addFavoriteSchema = Joi.object({
  recipeId: Joi.string().hex().length(24).required(),
});

const getValidateQueryShema = Joi.object({
  limit: Joi.number().min(1),
  page: Joi.number().min(1),
  q: Joi.string(),
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
