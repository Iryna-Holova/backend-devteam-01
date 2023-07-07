const { Schema, model, ObjectId } = require('mongoose');

const categorySchema = new Schema({
  _id: ObjectId,
  name: String,
});

const Category = model('category', categorySchema);

module.exports = Category;
