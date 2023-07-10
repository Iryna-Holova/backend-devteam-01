const express = require("express");
const {
  validateBody,
  validateId,
  authenticate,
  validateQuery,
} = require("../../middlewares");
const favoriteController = require("../../controllers/favorite-controller");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get(
  "/",
  validateQuery(schemas.getValidateQueryShema),
  authenticate,
  favoriteController.getAll
);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addFavoriteSchema),
  favoriteController.save
);

router.delete("/:id", authenticate, validateId, favoriteController.deleteById);

module.exports = router;
