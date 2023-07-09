const { HttpError } = require('../helpers');

const isValidParams = schema => {
  const func = (req, res, next) => {
    if (Object.keys(req.params).length) {
      const { error } = schema.validate(req.params);
      if (error) {
        next(HttpError(400, `invalid request query: ${error.message}`));
      }
    }
    next();
  };
  return func;
};

module.exports = isValidParams;
