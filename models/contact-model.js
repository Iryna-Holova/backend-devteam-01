const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

contactSchema.post("save", handleMongooseError);

const phoneRegexp = /^\(\d{3}\)\s\d{3}-\d{4}$/;
const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().regex(emailRegexp),
  phone: Joi.string().required().regex(phoneRegexp),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const requestParamsSchema = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string().regex(emailRegexp),
  phone: Joi.string().regex(phoneRegexp),
  favorite: Joi.boolean(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
  requestParamsSchema,
};

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};
