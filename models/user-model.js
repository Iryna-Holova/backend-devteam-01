const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
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
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
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
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "any.required": "Password is required",
    "string.min": "Password must contain at least 6 characters",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": "Invalid email",
    "string.empty": "Email is required",
    "string.pattern.base": "Invalid email",
    "any.required": "Email is required",
  }),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": "Invalid email",
    "string.empty": "Email is required",
    "string.pattern.base": "Invalid email",
    "any.required": "missing required field email",
  }),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "any.required": "Password is required",
    "string.min": "Password must contain at least 6 characters",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": "Invalid email",
    "string.empty": "Email is required",
    "string.pattern.base": "Invalid email",
    "any.required": "Email is required",
  }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.only": "subscription must be one of: starter, pro, business",
      "any.required": "subscription type is required",
    }),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  updateSubscriptionSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
