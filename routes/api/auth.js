const express = require('express');

const router = express.Router();

const {authenticate} = require("../../middlewares")

const { validateBody } = require("../../middlewares");

const schemas = require("../../validator/users");

const { register, login, getCurrent, logout, updateSubscription } = require("../../controllers/auth");

router.post("/register", validateBody(schemas.registerSchema), register);

router.post("/login", validateBody(schemas.loginSchema), login);

router.get("/current", authenticate, getCurrent)

router.post("/logout", authenticate, logout);

module.exports = router;
