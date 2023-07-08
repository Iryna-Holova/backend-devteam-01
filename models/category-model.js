const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: String,
});

const Category = model("category", categorySchema);

module.exports = Category;
