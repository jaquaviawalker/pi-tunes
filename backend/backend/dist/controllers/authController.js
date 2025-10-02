"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = handleLogin;
exports.handleCallback = handleCallback;
const logger_1 = __importDefault(require("../utils/logger"));
const SpotifyClient_1 = require("../src/SpotifyClient");
async function handleLogin(req, res) {
    try {
        const client = new SpotifyClient_1.SpotifyClient();
        res.redirect(client.userLogin());
    }
    catch (error) {
        logger_1.default.error('Login error', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        res.status(500).send('Error initiating login process');
    }
}
async function handleCallback(req, res) {
    const code = req.query.code;
    const error = req.query.error;
    if (error) {
        return res.status(400).send('Authentication failed: ' + error);
    }
    if (!code) {
        return res.status(400).send('No authorization code received');
    }
    try {
        const client = new SpotifyClient_1.SpotifyClient();
        client.setCode(code);
        await client.authenticate(SpotifyClient_1.AuthType.AUTH_CODE);
        res.send('Successfully authenticated with Spotify!');
    }
    catch (error) {
        logger_1.default.error('Authentication error', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        res.status(500).send('Error during authentication');
    }
}
