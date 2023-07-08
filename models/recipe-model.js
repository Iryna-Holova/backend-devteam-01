const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const recipeSchema = new Schema({
  title: {
    type: String,
    minlength: [2, 'Title must contain at least 2 characters'],
    required: [true, 'Title is required'],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  area: { type: String },
  instruction: { type: String, required: [true, 'Instruction is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  thumb: { type: String },
  preview: { type: String },
  time: { type: String, required: [true, 'Time is required'] },
  yuotube: { type: String },
  tags: { type: String },
  ingredients: {
    type: [
      {
        id: {
          type: String,
          required: [true, 'Ingredient is required'],
        },
        measure: { type: String, required: [true, 'Measure is required'] },
      },
    ],
  },
  favorites: {
    type: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'users',
          required: [true, 'User Id is required for set Favorite'],
        },
      },
    ],
  },
  owner: {
    type: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User Id is required for set Favorite'],
      },
    },
  },
});

recipeSchema.post('save', handleMongooseError);
const Recipe = model('recipe', recipeSchema);

//********Joi schemas */

const limitMainPageSchema = Joi.object({
  limit: Joi.number().default(1).valid(1, 2, 4),
});

const schemas = {
  limitMainPageSchema,
};

module.exports = {
  Recipe,
  schemas,
};
