import { Configuration } from './RfidConfiguration';
import { AlbumMapping } from './AlbumMapping';
import logger from '../utils/logger';

/**
 * Custom error for when the scanner is not initialized
 */
export class ScannerNotInitializedError extends Error {
  constructor(message = 'RFIDScanner not initialized') {
    super(message);
    this.name = 'ScannerNotInitializedError';
  }
}

/**
 * Type definition for RFID tag IDs
 */
export type TagID = string;

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
export class RFIDScanner {
  private RFIDTags: TagID[];
  private successRate: number;
  private initDelay: number;
  private connectionStatus: boolean;

  /**
   * Creates a new RFIDScanner instance
   * @param config - Optional configuration parameters
   */
  constructor(config?: Configuration) {
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

    logger.info('RFIDScanner created', {
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
  private validateTagSet(tags: TagID[]): void {
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error('Tag set must be a non-empty array');
    }
  }

  /**
   * Validates the success rate
   * @param rate - Success rate percentage (0-100)
   * @throws Error if rate is invalid
   */
  private validateSuccessRate(rate: number): void {
    if (rate < 0 || rate > 100) {
      throw new Error('Success rate must be between 0 and 100');
    }
  }

  /**
   * Validates the initialization delay
   * @param delay - Delay in milliseconds
   * @throws Error if delay is invalid
   */
  private validateInitDelay(delay: number): void {
    if (delay < 0) {
      throw new Error('Init delay cannot be negative');
    }
  }

  /**
   * Initializes the scanner hardware
   * @returns Promise that resolves when initialization is complete
   */
  public async init(): Promise<void> {
    logger.info('Initializing RFID scanner', { delay: this.initDelay });

    return new Promise((resolve) => {
      setTimeout(() => {
        this.connectionStatus = true;
        logger.info('RFID scanner initialized successfully');
        resolve();
      }, this.initDelay);
    });
  }

  /**
   * Checks if the scanner is connected and ready
   * @returns True if scanner is initialized and connected
   */
  public isConnected(): boolean {
    return this.connectionStatus;
  }

  /**
   * Simulates scanning an RFID tag
   * @returns Promise resolving to tag ID if successful, null if scan fails
   * @throws ScannerNotInitializedError if scanner is not initialized
   */
  public async scan(): Promise<TagID | null> {
    if (!this.connectionStatus) {
      logger.error('Attempted to scan without initializing scanner');
      throw new ScannerNotInitializedError();
    }

    if (Math.floor(Math.random() * 101) > this.successRate) {
      logger.debug('Scan failed (based on success rate)');
      return null;
    }

    const selectedTag =
      this.RFIDTags[Math.floor(Math.random() * this.RFIDTags.length)];
    logger.debug('Tag scanned successfully', { tagId: selectedTag });

    return selectedTag;
  }

  /**
   * Scans an RFID tag and looks up the associated album
   * @param albumMapping - Optional AlbumMapping instance (will create one if not provided)
   * @returns Promise resolving to the album ID associated with the scanned tag
   * @throws ScannerNotInitializedError if scanner is not initialized
   * @throws Error if no album is found for the scanned tag
   */
  public async scanAlbum(albumMapping?: AlbumMapping): Promise<string> {
    if (!this.connectionStatus) {
      logger.error('Attempted to scan album without initializing scanner');
      throw new ScannerNotInitializedError();
    }

    const scannedTagId = await this.scan();
    if (scannedTagId === null) {
      logger.error('Failed to scan tag');
      throw new Error('Failed to scan RFID tag');
    }

    logger.info('Tag scanned successfully', { tagId: scannedTagId });

    try {
      const mapping = albumMapping || (await AlbumMapping.create());
      const albumId = mapping.getAlbumByTagId(scannedTagId);

      if (albumId === null) {
        logger.error('No album found for tag', { tagId: scannedTagId });
        throw new Error(`Album not found for tag ID: ${scannedTagId}`);
      }

      logger.info('Found album for tag', { tagId: scannedTagId, albumId });
      return albumId;
    } catch (error: unknown) {
      logger.error('Error looking up album', {
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
