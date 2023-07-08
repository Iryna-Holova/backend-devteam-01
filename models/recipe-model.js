const { Schema, model } = require("mongoose");

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
  tags: [String],
  ingredients: [
    {
      id: { type: String, ref: "ingredient" },
      measure: String,
    },
  ],
});

const Recipe = model("recipe", recipeSchema);

module.exports = Recipe;
