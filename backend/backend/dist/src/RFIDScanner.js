"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RFIDScanner = exports.ScannerNotInitializedError = void 0;
const AlbumMapping_1 = require("./AlbumMapping");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Custom error for when the scanner is not initialized
 */
class ScannerNotInitializedError extends Error {
    constructor(message = 'RFIDScanner not initialized') {
        super(message);
        this.name = 'ScannerNotInitializedError';
    }
}
exports.ScannerNotInitializedError = ScannerNotInitializedError;
/**
 * Default scanner configuration values
 */
const DEFAULT_CONFIG = {
    rfidTags: ['111', '222', '333', '444'],
    successRate: 100,
    initDelay: 500,
};
/**
 * RFID Scanner class for simulating tag scanning hardware
 */
class RFIDScanner {
    /**
     * Creates a new RFIDScanner instance
     * @param config - Optional configuration parameters
     */
    constructor(config) {
        this.RFIDTags = [...DEFAULT_CONFIG.rfidTags];
        this.successRate = DEFAULT_CONFIG.successRate;
        this.initDelay = DEFAULT_CONFIG.initDelay;
        this.connectionStatus = false;
        if (config) {
            if (config.customTagSets) {
                this.validateTagSet(config.customTagSets);
                this.RFIDTags = config.customTagSets;
            }
            if (config.successRate !== undefined) {
                this.validateSuccessRate(config.successRate);
                this.successRate = config.successRate;
            }
            if (config.initDelay !== undefined) {
                this.validateInitDelay(config.initDelay);
                this.initDelay = config.initDelay;
            }
        }
        logger_1.default.info('RFIDScanner created', {
            tagCount: this.RFIDTags.length,
            successRate: this.successRate,
            initDelay: this.initDelay,
        });
    }
    /**
     * Validates the tag set
     * @param tags - Array of tag IDs to validate
     * @throws Error if tags are invalid
     */
    validateTagSet(tags) {
        if (!Array.isArray(tags) || tags.length === 0) {
            throw new Error('Tag set must be a non-empty array');
        }
    }
    /**
     * Validates the success rate
     * @param rate - Success rate percentage (0-100)
     * @throws Error if rate is invalid
     */
    validateSuccessRate(rate) {
        if (rate < 0 || rate > 100) {
            throw new Error('Success rate must be between 0 and 100');
        }
    }
    /**
     * Validates the initialization delay
     * @param delay - Delay in milliseconds
     * @throws Error if delay is invalid
     */
    validateInitDelay(delay) {
        if (delay < 0) {
            throw new Error('Init delay cannot be negative');
        }
    }
    /**
     * Initializes the scanner hardware
     * @returns Promise that resolves when initialization is complete
     */
    async init() {
        logger_1.default.info('Initializing RFID scanner', { delay: this.initDelay });
        return new Promise((resolve) => {
            setTimeout(() => {
                this.connectionStatus = true;
                logger_1.default.info('RFID scanner initialized successfully');
                resolve();
            }, this.initDelay);
        });
    }
    /**
     * Checks if the scanner is connected and ready
     * @returns True if scanner is initialized and connected
     */
    isConnected() {
        return this.connectionStatus;
    }
    /**
     * Simulates scanning an RFID tag
     * @returns Promise resolving to tag ID if successful, null if scan fails
     * @throws ScannerNotInitializedError if scanner is not initialized
     */
    async scan() {
        if (!this.connectionStatus) {
            logger_1.default.error('Attempted to scan without initializing scanner');
            throw new ScannerNotInitializedError();
        }
        if (Math.floor(Math.random() * 101) > this.successRate) {
            logger_1.default.debug('Scan failed (based on success rate)');
            return null;
        }
        const selectedTag = this.RFIDTags[Math.floor(Math.random() * this.RFIDTags.length)];
        logger_1.default.debug('Tag scanned successfully', { tagId: selectedTag });
        return selectedTag;
    }
    /**
     * Scans an RFID tag and looks up the associated album
     * @param albumMapping - Optional AlbumMapping instance (will create one if not provided)
     * @returns Promise resolving to the album ID associated with the scanned tag
     * @throws ScannerNotInitializedError if scanner is not initialized
     * @throws Error if no album is found for the scanned tag
     */
    async scanAlbum(albumMapping) {
        if (!this.connectionStatus) {
            logger_1.default.error('Attempted to scan album without initializing scanner');
            throw new ScannerNotInitializedError();
        }
        const scannedTagId = await this.scan();
        if (scannedTagId === null) {
            logger_1.default.error('Failed to scan tag');
            throw new Error('Failed to scan RFID tag');
        }
        logger_1.default.info('Tag scanned successfully', { tagId: scannedTagId });
        try {
            const mapping = albumMapping || (await AlbumMapping_1.AlbumMapping.create());
            const albumId = mapping.getAlbumByTagId(scannedTagId);
            if (albumId === null) {
                logger_1.default.error('No album found for tag', { tagId: scannedTagId });
                throw new Error(`Album not found for tag ID: ${scannedTagId}`);
            }
            logger_1.default.info('Found album for tag', { tagId: scannedTagId, albumId });
            return albumId;
        }
        catch (error) {
            logger_1.default.error('Error looking up album', {
                error,
                tagId: scannedTagId,
            });
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown error looking up album');
        }
    }
}
exports.RFIDScanner = RFIDScanner;
