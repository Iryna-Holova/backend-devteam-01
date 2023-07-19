const { HttpError } = require("../helpers");

const validateMultipart = ({ schema, key }) => {
  const func = (req, res, next) => {
    if (!req.body[key]) {
      next(HttpError(400, "JSON must be as multipart form-data"));
    }

    const parsed = JSON.parse(req.body[key]);

    if (!Object.keys(parsed).length) {
      next(HttpError(400, "Missing fields"));
    } else {
      const { error } = schema.validate(parsed);
      if (error) {
        next(HttpError(400, error.message));
      }
    }
    next();
  };
  return func;
};

module.exports = validateMultipart;
