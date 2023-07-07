const HttpError = require("../helpers/httpError");

const isValidBody = (schema, message = "missing fields") => {
  const func = (req, res, next) => {
    if (!Object.keys(req.body).length) {
      next(HttpError(400, message));
    } else {
      const { error } = schema.validate(req.body);
      if (error) {
        next(HttpError(400, error.message));
      }
    }
    next();
  };
  return func;
};

module.exports = isValidBody;
