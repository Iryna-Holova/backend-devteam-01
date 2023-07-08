const { Schema, model } = require("mongoose");

const ingredientsSchema = new Schema({
  name: String,
  decs: String,
  img: String,
});

const Ingredients = model("ingredient", ingredientsSchema);

module.exports = Ingredients;
