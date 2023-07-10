const express = require('express');

const ctrl = require("../../controllers/subscription-controller");
const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user-model");

const router = express.Router();

router.post("/subscribe", authenticate, validateBody(schemas.emailSchema), ctrl.sendSubscriptionEmail);
module.exports = router;