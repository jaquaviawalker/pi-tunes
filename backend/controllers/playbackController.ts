import { AlbumMapping } from '../src/AlbumMapping';
import { RFIDScanner } from '../src/RFIDScanner';
import { SpotifyClient, AuthType } from '../src/SpotifyClient';
import logger from '../utils/logger';
import { Request, Response } from 'express';

export async function handlePlayAlbum(req: Request, res: Response) {
  logger.info('Album playback requested');
  try {
    const scanner = new RFIDScanner();
    await scanner.init();

    const albumMapping = await AlbumMapping.create();
    const albumId = await scanner.scanAlbum(albumMapping);
    logger.info('Album scanned successfully', { albumId });

    const client = new SpotifyClient();
    await client.authenticate(AuthType.AUTH_CODE);
    const spotifyDevice = await client.getAvailableDevices();
    if (!spotifyDevice) {
      logger.warn('No Spotify devices available');
      return res.status(400).json({
        success: false,
        message:
          'No Spotify devices available. Please open Spotify on a device first.',
      });
    }
    client.setAlbumId(albumId);
    client.setDeviceId(spotifyDevice.id);

    await client.playAlbum();
    logger.info('Album playback successful', {
      albumId,
      deviceName: spotifyDevice.name,
    });
    res.status(200).json({
      success: true,
      message: `Album is now playing on ${spotifyDevice.name}`,
    });
  } catch (error) {
    logger.error('Error playing album', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.message.includes('authentication')) {
      logger.error('Spotify authentication failed', { error: error.message });
      return res.status(401).json({
        success: false,
        error: 'Authentication with Spotify failed',
      });
    }

    if (error instanceof Error && error.message.includes('scanner')) {
      logger.error('RFID scanner error', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'RFID scanner error occurred',
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
