const express = require("express");
const { validateBody, validateId, authenticate } = require("../../middlewares");
const shoppingListController = require("../../controllers/shopping-list-controller");
const { shoppingListSchemas } = require("../../models/shopping-list-model");

const router = express.Router();

router.get("/", authenticate, shoppingListController.getAll);

router.post(
  "/",
  authenticate,
  validateBody(shoppingListSchemas.createSchema),
  shoppingListController.create
);

router.delete(
  "/:id",
  authenticate,
  validateId,
  shoppingListController.deleteById
);

module.exports = router;
