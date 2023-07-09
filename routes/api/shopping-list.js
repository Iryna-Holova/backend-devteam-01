const express = require("express");
const { isValidBody, isValidId, authenticate } = require("../../middlewares");
const shoppingListController = require("../../controllers/shopping-list-controller");
const { shoppingListSchemas } = require("../../models/shopping-list-model");

const router = express.Router();

router.get("/", authenticate, shoppingListController.getAll);

router.post(
  "/",
  authenticate,
  isValidBody(shoppingListSchemas.createSchema),
  shoppingListController.create
);

router.delete(
  "/:id",
  authenticate,
  isValidId,
  shoppingListController.deleteById
);

module.exports = router;
