const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError, validationMessages } = require("../helpers");
const { ShoppingListSchema } = require("./shopping-list-model");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [2, "Name should be at least 2 characters"],
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      minlength: [6, "Password must contain at least 6 characters"],
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [emailRegexp, "Invalid email"],
      required: [true, "Email is required"],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    shoppingList: { type: [ShoppingListSchema], default: [] },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  baseURL: Joi.string().required().messages(validationMessages),
  user: Joi.object({
    name: Joi.string().min(2).required().messages(validationMessages),
    email: Joi.string()
      .pattern(emailRegexp)
      .required()
      .messages(validationMessages),
    password: Joi.string().min(6).required().messages(validationMessages),
  }).required(),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages(validationMessages),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required().messages(validationMessages),
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages(validationMessages),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
