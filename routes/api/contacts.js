const express = require("express");

const ctrl = require("../../controllers/contacts-controller");

const {
  authenticate,
  isValidId,
  isValidBody,
  isValidParams,
} = require("../../middlewares");

const { schemas } = require("../../models/contact-model");

const router = express.Router();

router.use(authenticate);

router.get("/", isValidParams(schemas.requestParamsSchema), ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", isValidBody(schemas.addSchema), ctrl.add);

router.delete("/:contactId", isValidId, ctrl.deleteById);

router.put(
  "/:contactId",
  isValidId,
  isValidBody(schemas.addSchema),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  isValidBody(schemas.updateFavoriteSchema, "missing field favorite"),
  ctrl.updateFavorite
);

module.exports = router;
