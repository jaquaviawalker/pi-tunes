"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyClient = exports.AuthType = void 0;
const dotenv = __importStar(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
dotenv.config();
/**
 * Authentication strategy types for Spotify API
 */
var AuthType;
(function (AuthType) {
    AuthType["CLIENT_CREDENTIALS"] = "CLIENT_CREDENTIALS";
    AuthType["AUTH_CODE"] = "AUTH_CODE";
    AuthType["REFRESH_TOKEN"] = "REFRESH_TOKEN";
})(AuthType || (exports.AuthType = AuthType = {}));
/**
 * Client for interacting with the Spotify Web API.
 * Handles authentication, token management, and searching for music content.
 */
class SpotifyClient {
    /**
     * Creates a new SpotifyClient instance.
     * Initializes the Spotify Web API with credentials from environment variables.
     * @param {string} [code] - Optional authorization code for authCode flow
     */
    constructor() {
        this.code = '';
        this.deviceId = '';
        this.albumId = '';
        this.authenticationStatus = false;
        this.tokenExpirationTime = 0;
        this.tokenExpirationThreshold = 60000;
        this.spotifyApi = new spotify_web_api_node_1.default({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI,
        });
    }
    /**
     * Authenticate with the Spotify API using the specified authentication type
     *
     * @param authType - Authentication strategy to use
     * @returns Promise that resolves when authentication is complete
     * @throws Error if authentication fails
     */
    async authenticate(authType = AuthType.CLIENT_CREDENTIALS) {
        try {
            switch (authType) {
                case AuthType.CLIENT_CREDENTIALS:
                    await this.authenticateWithClientCredentials();
                    break;
                case AuthType.AUTH_CODE:
                    if (!this.code) {
                        throw new Error('Authorization code is required for AUTH_CODE strategy');
                    }
                    await this.authenticateWithAuthCode();
                    break;
                case AuthType.REFRESH_TOKEN:
                    await this.authenticateWithRefreshToken();
                    break;
                default:
                    throw new Error(`Unsupported authentication type: ${authType}`);
            }
        }
        catch (error) {
            logger_1.default.error('Authentication failed', {
                authType,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    /**
     * Authenticates with Spotify using client credentials flow.
     * @private
     */
    async authenticateWithClientCredentials() {
        try {
            const data = await this.spotifyApi.clientCredentialsGrant();
            this.authenticationStatus = true;
            this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
            logger_1.default.info('Access token received', {
                expiresIn: data.body.expires_in,
                expirationTime: new Date(this.tokenExpirationTime).toISOString(),
            });
            this.spotifyApi.setAccessToken(data.body.access_token);
        }
        catch (err) {
            logger_1.default.error('Failed to get access token using client credentials', {
                error: err instanceof Error ? err.message : String(err),
            });
            throw err;
        }
    }
    generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    userLogin() {
        const state = this.generateRandomString(16);
        const scopes = [
            'user-read-private',
            'user-read-email',
            'user-read-playback-state',
            'user-read-playback-state',
        ];
        return this.spotifyApi.createAuthorizeURL(scopes, state);
    }
    /**
     * Authenticates with Spotify using authorization code.
     * @private
     */
    async authenticateWithAuthCode() {
        try {
            const data = await this.spotifyApi.authorizationCodeGrant(this.code);
            this.authenticationStatus = true;
            this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
            logger_1.default.info('Auth code token received', {
                expiresIn: data.body.expires_in,
                expirationTime: new Date(this.tokenExpirationTime).toISOString(),
            });
            this.spotifyApi.setAccessToken(data.body.access_token);
            this.spotifyApi.setRefreshToken(data.body.refresh_token);
        }
        catch (err) {
            logger_1.default.error('Failed to get access token using auth code', {
                error: err instanceof Error ? err.message : String(err),
            });
            throw err;
        }
    }
    /**
     * Refreshes the access token using the refresh token if necessary
     * @private
     */
    async authenticateWithRefreshToken() {
        if (!this.isTokenExpired() || !this.spotifyApi.getRefreshToken()) {
            return;
        }
        try {
            const data = await this.spotifyApi.refreshAccessToken();
            this.spotifyApi.setAccessToken(data.body.access_token);
            if (data.body.refresh_token) {
                this.spotifyApi.setRefreshToken(data.body.refresh_token);
            }
            this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
            this.authenticationStatus = true;
            logger_1.default.info('Access token refreshed', {
                expiresIn: data.body.expires_in,
                expirationTime: new Date(this.tokenExpirationTime).toISOString(),
            });
        }
        catch (err) {
            this.authenticationStatus = false;
            logger_1.default.error('Failed to refresh access token', {
                error: err instanceof Error ? err.message : String(err),
            });
            throw err;
        }
    }
    /**
     * @deprecated Use authenticate(AuthType.AUTH_CODE) instead
     */
    async authCode() {
        return this.authenticate(AuthType.AUTH_CODE);
    }
    /**
     * @deprecated Use authenticate(AuthType.REFRESH_TOKEN) instead
     */
    async refreshAccessToken() {
        return this.authenticate(AuthType.REFRESH_TOKEN);
    }
    /**
     * Ensures the client is authenticated before making API calls.
     * If not authenticated or the token is expired, it will authenticate using the specified strategy.
     *
     * @private
     * @param authType - Authentication strategy to use
     * @returns Promise that resolves when authentication is confirmed
     */
    async ensureAuthentication(authType = AuthType.CLIENT_CREDENTIALS) {
        if (!this.isAuthenticated() || this.isTokenExpired()) {
            await this.authenticate(authType);
        }
    }
    /**
     * @deprecated Use ensureAuthentication(AuthType.CLIENT_CREDENTIALS) instead
     */
    async ensureAuthenticated() {
        return this.ensureAuthentication(AuthType.CLIENT_CREDENTIALS);
    }
    /**
     * @deprecated Use ensureAuthentication(AuthType.REFRESH_TOKEN) instead
     */
    async ensureAuth() {
        return this.ensureAuthentication(AuthType.REFRESH_TOKEN);
    }
    /**
     * Searches for albums on Spotify based on a query string.
     *
     * @param {string} query - The search query (album name, artist, etc.)
     * @param {Object} [options] - Optional search parameters
     * @param {number} [options.limit=5] - Maximum number of results to return
     * @returns {Promise<SpotifyAlbum[]>} Array of album objects with simplified properties
     * @throws {Error} If the search fails or authentication fails
     */
    async searchAlbum(query, options) {
        await this.ensureAuthentication(AuthType.CLIENT_CREDENTIALS);
        const searchOptions = {
            limit: options?.limit || 5,
        };
        try {
            const response = await this.spotifyApi.searchAlbums(query, searchOptions);
            const albums = response.body.albums?.items || [];
            if (albums.length === 0) {
                console.log(`No albums found matching: ${query}`);
            }
            return albums.map((album) => ({
                id: album.id,
                name: album.name,
                artists: album.artists.map((artist) => ({
                    id: artist.id,
                    name: artist.name,
                })),
                images: album.images.map((image) => ({
                    url: image.url,
                    height: image.height || 0,
                    width: image.width || 0,
                })),
                release_date: album.release_date,
                total_tracks: album.total_tracks,
                uri: album.uri,
            }));
        }
        catch (error) {
            console.error('Error searching for albums:', error);
            throw error;
        }
    }
    /**
     * Gets available Spotify playback devices, returns the first device or null if none found
     *
     * @returns First available device or null if no devices found
     */
    async getAvailableDevices() {
        await this.ensureAuthentication(AuthType.REFRESH_TOKEN);
        try {
            const response = await this.spotifyApi.getMyDevices();
            const devices = response.body.devices || [];
            if (devices.length === 0) {
                console.log('No devices found');
                return null;
            }
            const firstDevice = devices[0];
            const spotifyDevice = {
                id: firstDevice.id || '',
                is_active: Boolean(firstDevice.is_active),
                is_private_session: Boolean(firstDevice.is_private_session),
                is_restricted: Boolean(firstDevice.is_restricted),
                name: firstDevice.name || '',
                type: firstDevice.type || '',
                volume_percent: firstDevice.volume_percent === null
                    ? undefined
                    : firstDevice.volume_percent,
            };
            return spotifyDevice;
        }
        catch (error) {
            console.error('Error getting devices', error);
            throw error;
        }
    }
    /**
     * Plays the currently set album on the currently set device
     *
     * @returns Promise that resolves when the album starts playing
     * @throws Error if playing fails or authentication fails
     */
    async playAlbum() {
        await this.ensureAuthentication(AuthType.REFRESH_TOKEN);
        try {
            await this.spotifyApi.play({
                device_id: this.deviceId,
                context_uri: `spotify:album:${this.albumId}`,
            });
        }
        catch (error) {
            console.error('Error playing album', error);
            throw error;
        }
    }
    /**
     * Checks if the client is currently authenticated with Spotify.
     *
     * @returns True if authenticated, false otherwise
     */
    isAuthenticated() {
        return this.authenticationStatus;
    }
    /**
     * Checks if the current authentication token has expired or is about to expire.
     * Includes a threshold buffer time before actual expiration.
     *
     * @private
     * @returns True if the token is expired or will expire soon, false otherwise
     */
    isTokenExpired() {
        if (!this.tokenExpirationTime) {
            return true;
        }
        return (Date.now() > this.tokenExpirationTime - this.tokenExpirationThreshold);
    }
    /**
     * Sets the Spotify album ID to be used for playback
     *
     * @param albumId - Spotify album ID
     */
    setAlbumId(albumId) {
        this.albumId = albumId;
    }
    /**
     * Sets the Spotify authorization code to be used for Authorization
     *
     * @param code - Spotify authorization code
     */
    setCode(code) {
        this.code = code;
    }
    /**
     * Sets the Spotify device ID to use for playback
     *
     * @param deviceId - Spotify device ID
     */
    setDeviceId(deviceId) {
        this.deviceId = deviceId;
    }
}
exports.SpotifyClient = SpotifyClient;
