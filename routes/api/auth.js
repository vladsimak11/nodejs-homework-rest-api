const express = require('express');

const router = express.Router();

const { validateBody } = require("../../middlewares");

const schemas = require("../../validator/users");

const { register, login } = require("../../controllers/auth");

router.post("/register", validateBody(schemas.registerSchema), register);
router.post("/login", validateBody(schemas.loginSchema), login);

module.exports = router;