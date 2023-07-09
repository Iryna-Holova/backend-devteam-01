const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

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
        { _id: false, userId: { type: Schema.Types.ObjectId, ref: "user" } },
      ],
      default: [],
    },
  },
  { versionKey: false }
);

recipeSchema.post("save", handleMongooseError);

const createOwnRecipeSchema = Joi.object({
  title: Joi.string().min(2).trim().required(),
  category: Joi.valid(...categories).required(),
  area: Joi.string(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  thumb: Joi.string(),
  preview: Joi.string(),
  time: Joi.string().required(),
  youtube: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().hex().length(24).required(),
        measure: Joi.string().required(),
      })
    )
    .required(),
});

const Recipe = model("recipe", recipeSchema);

const limitMainPageSchema = Joi.object({
  limit: Joi.number().default(1).valid(1, 2, 4),
});

const getByCategoryParamsSchema = Joi.object({
  category: Joi.string()
    .valid(...categories)
    .required(),
});

const getByCategoryBodySchema = Joi.object({
  limit: Joi.number().required(),
});

const schemas = {
  limitMainPageSchema,
  createOwnRecipeSchema,
  getByCategoryParamsSchema,
  getByCategoryBodySchema,
};

module.exports = {
  Recipe,
  schemas,
};
