"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const education_1 = require("../controllers/education");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, education_1.getEducation);
exports.default = router;
