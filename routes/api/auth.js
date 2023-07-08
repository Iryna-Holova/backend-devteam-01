const express = require("express");

const ctrl = require("../../controllers/auth-controller");

const { authenticate, isValidBody, upload } = require("../../middlewares");
const { schemas } = require("../../models/user-model");

const router = express.Router();

router.post("/register", isValidBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verify);

router.post(
  "/verify",
  isValidBody(schemas.emailSchema),
  ctrl.resendVerify
);

router.post("/login", isValidBody(schemas.loginSchema), ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch("/update", authenticate, upload.single("avatar"), ctrl.updateUserProfile);

module.exports = router;
