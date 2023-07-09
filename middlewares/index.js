const authenticate = require("./authenticate");
const upload = require("./upload");
const validateBody = require("./validate-body");
const validateId = require("./validate-id");
const validateParams = require("./validate-params");
const validateQuery = require("./validate-query");

module.exports = {
  authenticate,
  upload,
  validateBody,
  validateId,
  validateParams,
  validateQuery,
};
