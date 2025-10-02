"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlbumMapping_1 = require("../../src/AlbumMapping");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let albumMap;
// Valid format examples
const validTagId = '1A2B3C4D5E6F'; // Valid hexadecimal
const validAlbumId = '123456789012345678901X'; // Valid 22-char alphanumeric
// Test data
const tagId = validTagId;
const albumId = validAlbumId;
const newAlbumId = '123456789012345678901Y';
// Invalid format examples
const invalidTagId = 'INVALID!';
const invalidAlbumId = 'too-short';
// Reset for each test
beforeEach(async () => {
    // Create an empty test-mappings.json file for each test
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    await require('fs/promises').writeFile(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('path').join(process.cwd(), 'test-mappings.json'), JSON.stringify({}));
    albumMap = await AlbumMapping_1.AlbumMapping.create('test-mappings.json');
});
describe('should Tag to ablum mapping', () => {
    test('should add a new mapping when given valid tag and album ID', async () => {
        await albumMap.addMapping(tagId, albumId);
        const result = albumMap.getAlbumByTagId(tagId);
        expect(result).toBe(albumId);
    });
    // Test null input error
    test('should throw error if parameters are null', async () => {
        await expect(albumMap.addMapping(null, null)).rejects.toThrow('Tag ID cannot be empty');
    });
    test('should throw error if parameters are a number ', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await expect(albumMap.addMapping(123, 456)).rejects.toThrow('Tag ID must be a string');
    });
    test('should throw error if tag ID format is invalid', async () => {
        await expect(albumMap.addMapping(invalidTagId, validAlbumId)).rejects.toThrow('Invalid tag ID format');
    });
    test('should throw error if album ID format is invalid', async () => {
        await expect(albumMap.addMapping(validTagId, invalidAlbumId)).rejects.toThrow('Invalid Spotify album ID format');
    });
    test('should remove album from given tagID', async () => {
        await albumMap.addMapping(tagId, albumId);
        let result = albumMap.getAlbumByTagId(tagId);
        expect(result).toBe(albumId);
        await albumMap.removeMapping(tagId);
        result = albumMap.getAlbumByTagId(tagId);
        // If getAlbumByTagId returns null/undefined for missing tags:
        expect(result).toBeNull();
    });
    test('should throw error when removing with invalid tag ID format', async () => {
        await expect(albumMap.removeMapping(invalidTagId)).rejects.toThrow('Invalid tag ID format: INVALID!. Must be 8-20 hexadecimal characters.');
    });
    test('should list all mappings ', async () => {
        const emptyList = await albumMap.listAllMappings();
        expect(emptyList).toHaveLength(0);
        await albumMap.addMapping(tagId, albumId);
        await albumMap.addMapping('ABCDEF123456', '123456789012345678901Z');
        const mappingsList = await albumMap.listAllMappings();
        expect(mappingsList).toHaveLength(2);
        expect(mappingsList).toContainEqual({
            tagId: tagId,
            albumId: albumId,
        });
        expect(mappingsList).toContainEqual({
            tagId: 'ABCDEF123456',
            albumId: '123456789012345678901Z',
        });
    });
    test('should update a new mapping', async () => {
        await albumMap.addMapping(tagId, albumId);
        const result = albumMap.getAlbumByTagId(tagId);
        expect(result).toBe(albumId);
        await albumMap.updateMapping(tagId, newAlbumId);
        const newResult = albumMap.getAlbumByTagId(tagId);
        expect(newResult).toBe(newAlbumId);
    });
    test('should throw error when updating with invalid tag ID format', async () => {
        await albumMap.addMapping(tagId, albumId);
        await expect(albumMap.updateMapping(invalidTagId, newAlbumId)).rejects.toThrow('Invalid tag ID format');
    });
    test('should throw error when updating with invalid album ID format', async () => {
        await albumMap.addMapping(tagId, albumId);
        await expect(albumMap.updateMapping(tagId, invalidAlbumId)).rejects.toThrow('Invalid Spotify album ID format');
    });
});
