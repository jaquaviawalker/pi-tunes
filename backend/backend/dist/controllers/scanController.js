"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleScanTagToAlbum = handleScanTagToAlbum;
const logger_1 = __importDefault(require("../utils/logger"));
const SpotifyClient_1 = require("../src/SpotifyClient");
const AlbumMapping_1 = require("../src/AlbumMapping");
async function handleScanTagToAlbum(req, res) {
    const tagId = req.params.tagId;
    const album = req.query.album;
    const artist = req.query.artist;
    try {
        const client = new SpotifyClient_1.SpotifyClient();
        await client.authenticate();
        const albums = await client.searchAlbum(album);
        if (!Array.isArray(albums) || albums.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No albums found for the given album name.',
            });
        }
        const match = albums.find((albumItem) => albumItem.artists.some((artistItem) => artistItem.name.trim().toLowerCase() === artist.toLowerCase()));
        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'No matching album found for artist',
            });
        }
        const albumId = match.id;
        const instance = await AlbumMapping_1.AlbumMapping.create();
        await instance.addMapping(tagId, albumId);
        res.status(200).json({
            success: true,
            tagId: tagId,
            message: `Tag ID: ${tagId} scanned and mapped to Album: ${album} by ${artist} successfully`,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        logger_1.default.error('Error scanning tag', {
            error: error instanceof Error ? error.message : 'Unknown error',
            tagId,
            album,
            artist,
        });
    }
}
