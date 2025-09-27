import { AlbumMetadata } from '../types/AlbumMetadata';
import { readFile, writeFile } from 'fs/promises';

export class AlbumMapping {
  private filePath: string;
  private mappings: Record<
    string,
    { albumId: string; metadata?: AlbumMetadata }
  >;

  constructor(filePath = 'album-mappings.json') {
    this.mappings = {};
    this.filePath = filePath;
  }
  public static async create(
    filePath = 'album-mappings.json'
  ): Promise<AlbumMapping> {
    const instance = new AlbumMapping(filePath);
    await instance.loadMapping();
    return instance;
  }
  public saveMapping = async (): Promise<void> => {
    try {
      const data = this.mappings;
      await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');

      console.log('Files created successfully');
    } catch (err) {
      console.error('Error Writing Files', err);
    }
  };
  public loadMapping = async (): Promise<void> => {
    try {
      const data = await readFile(this.filePath, 'utf8');
      this.mappings = JSON.parse(data);
      console.log('Mappings loaded successfully');
    } catch (error: any) {
      // If file doesn't exist, initialize with empty mappings
      if (error.code === 'ENOENT') {
        console.log(
          `No existing mappings file found at ${this.filePath}. Starting with empty mappings.`
        );
        this.mappings = {};
      } else {
        // Handle other errors (like JSON parsing errors)
        console.error('Error reading or parsing mappings file:', error);
        this.mappings = {};
      }
    }
  };
  public addMapping = async (tagId: string, albumId: string): Promise<void> => {
    try {
      if (!tagId || !albumId) {
        throw new Error('Input cannot be empty');
      }

      if (typeof tagId !== 'string' || typeof albumId !== 'string') {
        throw new Error('Input must be a string');
      }

      this.mappings[tagId] = {
        albumId,
      };

      await this.saveMapping();
    } catch (error) {
      console.error('Error adding mapping album to tag:', error);
      throw error; // Re-throw the error so calling code can handle it
    }
  };
  public removeMapping = async (tagId: string): Promise<void> => {
    try {
      if (!tagId) {
        throw new Error('Input cannot be empty');
      }

      if (typeof tagId !== 'string') {
        throw new Error('Input must be a string');
      }
      if (!this.mappings[tagId]) {
        throw new Error('Tag does not exist');
      }
      delete this.mappings[tagId];
      await this.saveMapping();
    } catch (error) {
      console.error('Error removing Mapping', error);
      throw error;
    }
  };
  public listAllMappings = (): { tagId: string; albumId: string }[] => {
    const allMappings: { tagId: string; albumId: string }[] = [];
    for (const tagId of Object.keys(this.mappings)) {
      const value = this.mappings[tagId];
      allMappings.push({ tagId: tagId, albumId: value.albumId });
    }
    return allMappings;
  };
  public updateMapping = async (
    tagId: string,
    newAlbumId: string
  ): Promise<void> => {
    try {
      if (!tagId || !newAlbumId) {
        throw new Error('Input cannot be empty');
      }
      if (typeof tagId !== 'string' || typeof newAlbumId !== 'string') {
        throw new Error('Input must be a string');
      }
      if (!this.mappings[tagId]) {
        throw new Error('Tag does not exist');
      } else {
        this.mappings[tagId] = {
          albumId: newAlbumId,
        };
      }
      await this.saveMapping();
    } catch (error) {
      console.error('Unable to update mapping', error);
      throw error;
    }
  };
  public getAlbumByTagId = (tagId: string): string | null => {
    if (this.mappings[tagId]) {
      return this.mappings[tagId].albumId;
    }
    return null;
  };
}
