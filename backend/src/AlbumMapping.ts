import {
  TagMapping,
  MappingResult,
  MappingsCollection,
} from '../interfaces/AlbumMapping';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import logger from '../utils/logger';

export class AlbumMapping {
  private filePath: string;
  private mappings: MappingsCollection;

  /**
   * Private constructor - use the static create method instead
   * @param filePath - Path to the JSON file storing the mappings
   */
  private constructor(filePath = 'album-mappings.json') {
    this.mappings = {};
    this.filePath = path.join(process.cwd(), filePath);
  }
  /**
   * Creates and initializes a new AlbumMapping instance
   * @param filePath - Path to the JSON file storing the mappings
   * @returns Promise resolving to initialized AlbumMapping instance
   */
  public static async create(
    filePath = 'album-mappings.json'
  ): Promise<AlbumMapping> {
    const instance = new AlbumMapping(filePath);
    await instance.loadMapping();
    return instance;
  }
  /**
   * Validates the format of an RFID tag ID
   * @param tagId - The RFID tag identifier to validate
   * @returns True if the format is valid, false otherwise
   */
  private validateTagId(tagId: string): boolean {
    const regex = /^[A-Fa-f0-9]{8,20}$/;
    return regex.test(tagId);
  }

  /**
   * Validates the format of a Spotify album ID
   * @param spotifyId - The Spotify ID to validate
   * @returns True if the format is valid, false otherwise
   */
  private validateSpotifyId(spotifyId: string): boolean {
    const regex = /^[A-Za-z0-9]{22}$/;
    return regex.test(spotifyId);
  }

  /**
   * Validates input parameters
   * @param tagId - The RFID tag identifier to validate
   * @param albumId - Optional Spotify album ID to validate
   * @throws Error if any validation fails
   */
  private validateInput(tagId: string, albumId?: string): void {
    if (!tagId) {
      throw new Error('Tag ID cannot be empty');
    }
    if (typeof tagId !== 'string') {
      throw new Error('Tag ID must be a string');
    }
    if (!this.validateTagId(tagId)) {
      throw new Error(
        `Invalid tag ID format: ${tagId}. Must be 8-20 hexadecimal characters.`
      );
    }
    if (albumId !== undefined) {
      if (!albumId) {
        throw new Error('Album ID cannot be empty');
      }
      if (typeof albumId !== 'string') {
        throw new Error('Album ID must be a string');
      }
      if (!this.validateSpotifyId(albumId)) {
        throw new Error(
          `Invalid Spotify album ID format: ${albumId}. Must be 22 alphanumeric characters.`
        );
      }
    }
  }

  /**
   * Saves the current mappings to the JSON file
   * @throws Error if the file cannot be written
   */
  public async saveMapping(): Promise<void> {
    try {
      const data = this.mappings;
      await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');

      logger.info('Mappings saved successfully', { path: this.filePath });
    } catch (err: unknown) {
      logger.error('Error writing mapping file', {
        error: err,
        path: this.filePath,
      });
      throw err; // Re-throw the error so calling code can handle it
    }
  }

  /**
   * Loads mappings from the JSON file
   * If the file doesn't exist, initializes with empty mappings
   */
  public async loadMapping(): Promise<void> {
    try {
      const data = await readFile(this.filePath, 'utf8');
      this.mappings = JSON.parse(data);
      logger.info('Mappings loaded successfully', { path: this.filePath });
    } catch (error: unknown) {
      // If file doesn't exist, initialize with empty mappings
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        logger.info(
          'No existing mappings file found. Starting with empty mappings.',
          { path: this.filePath }
        );
        this.mappings = {};
      } else {
        // Handle other errors (like JSON parsing errors)
        logger.error('Error reading or parsing mappings file', {
          error,
          path: this.filePath,
        });
        this.mappings = {};
      }
    }
  }

  /**
   * Associates an RFID tag with a Spotify album ID
   * @param tagId - The RFID tag identifier
   * @param albumId - The Spotify album ID to associate with the tag
   * @throws Error if inputs are invalid
   */
  public async addMapping(tagId: string, albumId: string): Promise<void> {
    try {
      this.validateInput(tagId, albumId);

      this.mappings[tagId] = {
        albumId,
      } as TagMapping;

      await this.saveMapping();
      logger.info('Added mapping', { tagId, albumId });
    } catch (error: unknown) {
      logger.error('Error adding mapping album to tag', {
        error,
        tagId,
        albumId,
      });
      throw error; // Re-throw the error so calling code can handle it
    }
  }

  /**
   * Removes a tag-to-album mapping
   * @param tagId - The RFID tag identifier to remove
   * @throws Error if tagId format is invalid
   */
  public async removeMapping(tagId: string): Promise<void> {
    try {
      this.validateInput(tagId);
      delete this.mappings[tagId];
      await this.saveMapping();
      logger.info('Removed mapping', { tagId });
    } catch (error: unknown) {
      logger.error('Error removing mapping', { error, tagId });
      throw error;
    }
  }

  /**
   * Lists all tag-to-album mappings
   * @returns Array of mapping results containing tagId and albumId pairs
   */
  public async listAllMappings(): Promise<MappingResult[]> {
    const allMappings: MappingResult[] = [];
    for (const tagId of Object.keys(this.mappings)) {
      const value = this.mappings[tagId];
      allMappings.push({ tagId: tagId, albumId: value.albumId });
    }
    return allMappings;
  }

  /**
   * Updates an existing tag-to-album mapping
   * @param tagId - The RFID tag identifier
   * @param newAlbumId - The new Spotify album ID to associate
   * @throws Error if tag doesn't exist or inputs are invalid
   */
  public async updateMapping(tagId: string, newAlbumId: string): Promise<void> {
    try {
      this.validateInput(tagId, newAlbumId);

      if (!this.mappings[tagId]) {
        throw new Error('Tag does not exist');
      } else {
        this.mappings[tagId] = {
          albumId: newAlbumId,
        } as TagMapping;
      }
      await this.saveMapping();
      logger.info('Updated mapping', { tagId, newAlbumId });
    } catch (error: unknown) {
      logger.error('Unable to update mapping', { error, tagId, newAlbumId });
      throw error;
    }
  }

  /**
   * Retrieves the album ID associated with a tag
   * @param tagId - The RFID tag identifier
   * @returns The album ID if found, null otherwise
   * @throws Error if tagId format is invalid
   */
  public getAlbumByTagId(tagId: string): string | null {
    try {
      this.validateInput(tagId);
      if (this.mappings[tagId]) {
        logger.debug('Retrieved album ID for tag', {
          tagId,
          albumId: this.mappings[tagId].albumId,
        });
        return this.mappings[tagId].albumId;
      }
      logger.debug('No album found for tag', { tagId });
      return null;
    } catch (error: unknown) {
      logger.error('Error retrieving album ID', { error, tagId });
      throw error;
    }
  }

  /**
   * Checks if a tag exists in the mappings
   * @param tagId - The RFID tag identifier to check
   * @returns True if the tag exists, false otherwise
   */
  public hasTag(tagId: string): boolean {
    try {
      this.validateInput(tagId);
      return !!this.mappings[tagId];
    } catch (error: unknown) {
      logger.error('Error checking tag existence', { error, tagId });
      return false;
    }
  }
}
