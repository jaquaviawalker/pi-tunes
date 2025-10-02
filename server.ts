import express, { Request, Response } from 'express';
import { AlbumMapping } from './src/AlbumMapping';
import { RFIDScanner } from './src/RFIDScanner';
import { SpotifyClient } from './src/SpotifyClient';

import dotenv from 'dotenv';
dotenv.config();

const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Basic route for Task 5A - "Hello World" response
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Welcome to the RFID Spotify Player API');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
