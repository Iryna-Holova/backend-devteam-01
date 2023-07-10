const express = require("express");
const {
  validateBody,
  validateId,
  authenticate,
  validateQuery,
} = require("../../middlewares");
const ctrl = require("../../controllers/ownRecipes-controller");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get(
  "/",
  validateQuery(schemas.getValidateQueryShema),
  authenticate,
  ctrl.getOwn
);

router.post(
  "/",
  authenticate,
  validateBody(schemas.createOwnRecipeSchema),
  ctrl.create
);

router.delete("/:id", authenticate, validateId, ctrl.deleteById);

module.exports = router;
