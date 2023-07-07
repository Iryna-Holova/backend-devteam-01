const HttpError = require("../helpers/httpError");

const isValidParams = (schema) => {
  const func = (req, res, next) => {
    if (Object.keys(req.query).length) {
      const { error } = schema.validate(req.query);
      if (error) {
        next(HttpError(400, `invalid request query: ${error.message}`));
      }
    }
    next();
  };
  return func;
};

module.exports = isValidParams;
