const express = require("express");
const { isValidBody, isValidId, authenticate } = require("../../middlewares");
const favoriteController = require("../../controllers/favorite-controller");

const router = express.Router();

router.get("/", authenticate, favoriteController.getAll);

router.post("/", authenticate, favoriteController.save);

// router.delete(
//   "/:id",
//   authenticate,
//   isValidId,
//   shoppingListController.deleteById
// );

module.exports = router;
