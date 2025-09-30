import express, { Request, Response } from 'express';
import { AlbumMapping } from './src/AlbumMapping';
import { RFIDScanner } from './src/RFIDScanner';
import { SpotifyClient } from './src/SpotifyClient';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Basic route for Task 5A - "Hello World" response
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Welcome to the RFID Spotify Player API');
});

// In your frontend or route handler
app.get('/login', async (req, res) => {
  try {
    const client = new SpotifyClient();
    res.redirect(client.userLogin());
  } catch (error) {}
});

app.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  const error = req.query.error;

  if (error) {
    return res.status(400).send('Authentication failed: ' + error);
  }

  if (!code) {
    return res.status(400).send('No authorization code received');
  }

  try {
    const client = new SpotifyClient();
    client.code = code;
    await client.authCode();
    res.send('Successfully authenticated with Spotify!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during authentication');
  }
});

app.post('/scan/:tagId', async (req: Request, res: Response) => {
  try {
    const tagId = req.params.tagId;
    const album = req.query.album as string;
    const artist = req.query.artist as string;
    if (!album || !artist) {
      throw new Error('Must enter artist name and album name');
    }
    if (!tagId || tagId == '') {
      throw new Error('No valid Tag Id Exists');
    }
    if (!/^[A-Fa-f0-9]{8,20}$/.test(tagId)) {
      throw new Error('Invalid tag format: must be 8-20 hex characters');
    }
    const client = new SpotifyClient();
    await client.authenticate();
    const albums = await client.searchAlbum(album);
    if (!Array.isArray(albums) || albums.length === 0) {
      throw new Error('No albums found for the given album name.');
    }
    const match = albums.find(
      (album) =>
        typeof album.artist === 'string' &&
        album.artist.trim().toLowerCase() === artist.toLowerCase()
    );
    if (!match) {
      throw new Error('No matching album found for artist');
    }
    const albumId = match.id;

    const instance = await AlbumMapping.create();
    await instance.addMapping(tagId, albumId);
    res.status(200).json({
      success: true,
      tagId: tagId,
      message: `Tag ID: ${tagId} scanned and mapped to Album: ${album} by ${artist} successfully`,
    });
  } catch (error: unknown) {
    console.error('Error scanning Tag', error);
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: 'Unknown error' });
    }
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
