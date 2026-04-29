"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const threat_source_1 = require("../controllers/threat-source");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/top", auth_1.authenticate, threat_source_1.getTopThreatSources);
exports.default = router;
