"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playbackRoutes_1 = __importDefault(require("./routes/playbackRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authRoutes_2 = __importDefault(require("./routes/authRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', playbackRoutes_1.default);
app.use('/api', authRoutes_2.default);
app.use('/api', authRoutes_1.default);
app.use('/api', testRoutes_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
