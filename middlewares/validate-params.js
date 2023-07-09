const { HttpError } = require("../helpers");

const validateParams = (schema) => {
  const func = (req, res, next) => {
    if (Object.keys(req.params).length) {
      const { error } = schema.validate(req.params);
      if (error) {
        next(HttpError(400, `Invalid request params: ${error.message}`));
      }
    }
    next();
  };
  return func;
};

module.exports = validateParams;
