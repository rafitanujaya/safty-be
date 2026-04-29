"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middlewares/error");
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const event_1 = __importDefault(require("./routes/event"));
const history_1 = __importDefault(require("./routes/history"));
const file_1 = __importDefault(require("./routes/file"));
const image_1 = __importDefault(require("./routes/image"));
const education_1 = __importDefault(require("./routes/education"));
const setting_1 = __importDefault(require("./routes/setting"));
const threat_source_1 = __importDefault(require("./routes/threat-source"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.use("/api/events", event_1.default);
app.use("/api/history", history_1.default);
app.use("/api/files", file_1.default);
app.use("/api/images", image_1.default);
app.use("/api/education", education_1.default);
app.use("/api/settings", setting_1.default);
app.use("/api/threat-sources", threat_source_1.default);
// Middleware
app.use(error_1.errorHandler);
exports.default = app;
