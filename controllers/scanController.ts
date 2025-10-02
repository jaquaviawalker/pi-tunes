import { Response, Request } from 'express';
import logger from '../utils/logger';
import { SpotifyClient } from '../src/SpotifyClient';
import { AlbumMapping } from '../src/AlbumMapping';

export async function handleScanTagToAlbum(req: Request, res: Response) {
  const tagId = req.params.tagId;
  const album = req.query.album as string;
  const artist = req.query.artist as string;
  try {
    const client = new SpotifyClient();
    await client.authenticate();
    const albums = await client.searchAlbum(album);
    if (!Array.isArray(albums) || albums.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No albums found for the given album name.',
      });
    }
    const match = albums.find((albumItem) =>
      albumItem.artists.some(
        (artistItem) =>
          artistItem.name.trim().toLowerCase() === artist.toLowerCase()
      )
    );
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'No matching album found for artist',
      });
    }

    const albumId = match.id;

    const instance = await AlbumMapping.create();
    await instance.addMapping(tagId, albumId);
    res.status(200).json({
      success: true,
      tagId: tagId,
      message: `Tag ID: ${tagId} scanned and mapped to Album: ${album} by ${artist} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    logger.error('Error scanning tag', {
      error: error instanceof Error ? error.message : 'Unknown error',
      tagId,
      album,
      artist,
    });
  }
}
