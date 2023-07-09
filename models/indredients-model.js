const { Schema, model } = require("mongoose");

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    desc: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
  },
  { versionKey: false }
);

const Ingredient = model("ingredient", ingredientSchema);

module.exports = Ingredient;
