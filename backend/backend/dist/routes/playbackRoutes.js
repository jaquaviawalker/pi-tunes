"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playbackController_1 = require("../controllers/playbackController");
const router = express_1.default.Router();
router.post('play', playbackController_1.handlePlayAlbum);
exports.default = router;
