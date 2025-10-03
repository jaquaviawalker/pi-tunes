# Building a Spotify Album RFID Card Mapping System

This guide will walk you through creating a system that reads RFID cards and plays specific Spotify albums based on which card was scanned.

## Overview

The project will involve:
1. Reading RFID cards with your MFRC522 reader
2. Mapping card UIDs to Spotify albums
3. Controlling Spotify playback when cards are detected
4. Writing album IDs to cards (optional)

## Hardware Requirements

- Raspberry Pi (which you already have set up)
- MFRC522 RFID Reader (already connected)
- RFID cards/tags (already tested and working)
- Internet connection for Spotify API access

## Software Dependencies

### Core Dependencies
- `mfrc522-rpi`: For RFID card reading (already installed)
- `rpi-softspi`: For SPI communication with the RFID reader (already installed)
- `spotify-web-api-node`: For Spotify API integration

### Additional Helpful Packages
- `express`: For creating a local web server for Spotify authorization
- `dotenv`: For managing environment variables (API keys, etc.)
- `node-persist`: For persistent storage of card-to-album mappings

## Installation

Install the additional required packages:

```bash
npm install spotify-web-api-node express dotenv node-persist
```

## Spotify Developer Setup

1. Create a Spotify Developer account at https://developer.spotify.com/dashboard/
2. Create a new application to get your Client ID and Client Secret
3. Add `http://localhost:8888/callback` to your Redirect URIs in the app settings

## Project Structure

```
spotify-rfid-player/
│
├── app.js                  # Main application
├── auth.js                 # Spotify authentication handling
├── cardManager.js          # Card mapping and management
├── .env                    # Environment variables (API keys, etc.)
├── package.json            # Project dependencies
└── storage/                # Directory for storing card mappings
```

## Implementing the Core Functionality

### 1. Reading RFID Cards

You already have this working correctly with your MFRC522 setup. The code reads the card UID successfully.

### 2. Storing Card-to-Album Mappings

Create a system to map card UIDs to Spotify album IDs. This can be done with simple JSON storage or a database.

### 3. Spotify Authentication & Playback

Use the Spotify Web API to authenticate and control playback when a card is scanned.

## Key Functions You'll Need

### RFID Card Reading & Writing

You've already implemented card reading. Here are the key functions you need:

1. **Reading a Card UID**:
   ```javascript
   // Already implemented in your app.js
   function readCardUID() {
     // Your existing code that returns the card UID
   }
   ```

2. **Writing Data to a Card** (optional, if you want to store album IDs on the cards):
   ```javascript
   function writeAlbumIdToCard(blockNumber, albumId) {
     // Convert albumId to format suitable for card storage
     const data = albumIdToCardFormat(albumId);
     
     // Authenticate with the card
     if (mfrc522.authenticate(blockNumber, defaultKey, uid)) {
       // Write data to the specified block
       mfrc522.writeDataToBlock(blockNumber, data);
       return true;
     }
     return false;
   }
   ```

### Card-to-Album Mapping Functions

1. **Associate a Card with an Album**:
   ```javascript
   async function mapCardToAlbum(cardUID, spotifyAlbumId) {
     await storage.setItem(cardUID, spotifyAlbumId);
   }
   ```

2. **Get Album for a Scanned Card**:
   ```javascript
   async function getAlbumForCard(cardUID) {
     return await storage.getItem(cardUID);
   }
   ```

### Spotify API Functions

1. **Initialize Spotify API Client**:
   ```javascript
   const SpotifyWebApi = require('spotify-web-api-node');
   
   const spotifyApi = new SpotifyWebApi({
     clientId: process.env.SPOTIFY_CLIENT_ID,
     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
     redirectUri: 'http://localhost:8888/callback'
   });
   ```

2. **Authenticate with Spotify**:
   ```javascript
   // This is a simplified version - actual implementation will need a web server
   async function authenticateSpotify() {
     // See detailed implementation steps below
   }
   ```

3. **Play Album When Card is Scanned**:
   ```javascript
   async function playAlbum(albumId) {
     try {
       await spotifyApi.play({ context_uri: `spotify:album:${albumId}` });
       console.log(`Now playing album: ${albumId}`);
     } catch (error) {
       console.error('Error playing album:', error);
     }
   }
   ```

## Complete Implementation Steps

### Step 1: Set Up Your Environment

Create a `.env` file in your project root:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### Step 2: Create the Card Manager Module

Create `cardManager.js`:

```javascript
const storage = require('node-persist');

async function initStorage() {
  await storage.init({ dir: './storage' });
}

async function mapCardToAlbum(cardUID, albumId) {
  await storage.setItem(cardUID, albumId);
  console.log(`Mapped card ${cardUID} to album ${albumId}`);
}

async function getAlbumForCard(cardUID) {
  const albumId = await storage.getItem(cardUID);
  return albumId || null;
}

async function getAllMappings() {
  return await storage.values();
}

module.exports = {
  initStorage,
  mapCardToAlbum,
  getAlbumForCard,
  getAllMappings
};
```

### Step 3: Create the Spotify Authentication Module

Create `auth.js`:

```javascript
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:8888/callback'
});

// Function to get authorization URL
function getAuthorizationUrl() {
  const scopes = ['user-read-playback-state', 'user-modify-playback-state'];
  return spotifyApi.createAuthorizeURL(scopes);
}

// Set up Express server for auth callback
function setupAuthServer() {
  return new Promise((resolve) => {
    const app = express();
    
    const server = app.listen(8888, () => {
      console.log('Listening for Spotify auth callback on http://localhost:8888');
    });
    
    app.get('/callback', async (req, res) => {
      const { code } = req.query;
      
      try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        
        // Set access and refresh tokens
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        
        res.send('Authentication successful! You can now close this window.');
        server.close();
        resolve(true);
      } catch (error) {
        res.send('Authentication failed: ' + error.message);
        server.close();
        resolve(false);
      }
    });
  });
}

// Function to refresh the access token
async function refreshAccessToken() {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Access token refreshed');
    return true;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return false;
  }
}

module.exports = {
  spotifyApi,
  getAuthorizationUrl,
  setupAuthServer,
  refreshAccessToken
};
```

### Step 4: Update Main Application

Update your `app.js` to integrate everything:

```javascript
/**
 * Spotify RFID Card Album Player
 * This app reads RFID cards and plays associated Spotify albums.
 */

// Import required modules
const Mfrc522 = require('mfrc522-rpi');
const SoftSPI = require('rpi-softspi');
require('dotenv').config();
const cardManager = require('./cardManager');
const { spotifyApi, getAuthorizationUrl, setupAuthServer, refreshAccessToken } = require('./auth');
const readline = require('readline');

// Configure the connection to the RFID reader
const softSPI = new SoftSPI({
  clock: 23,  // SCK/SCLK pin
  mosi: 19,   // MOSI pin
  miso: 21,   // MISO pin
  client: 24  // CS/SDA pin
});

// Initialize the MFRC522 reader
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

// Function to convert array buffer to hexadecimal string (for card UIDs)
function bufferToHex(buffer) {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Variables to track state
let isConfigMode = false;
let lastScannedUID = null;
let authComplete = false;

// Initialize the application
async function init() {
  await cardManager.initStorage();
  
  console.log('Starting Spotify RFID Album Player...');
  console.log('First, you need to authenticate with Spotify.');
  console.log(`Open this URL in your browser: ${getAuthorizationUrl()}`);
  
  authComplete = await setupAuthServer();
  
  if (authComplete) {
    console.log('Authentication successful! You can now scan cards.');
    console.log('Press "c" to enter configuration mode, "q" to quit, any other key to continue...');
    startCardScanning();
  } else {
    console.log('Authentication failed. Please restart the application.');
    process.exit(1);
  }
}

// Handle keyboard input
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'c') {
    toggleConfigMode();
  } else if (key.name === 'q') {
    console.log('Exiting application...');
    process.exit(0);
  }
});

// Toggle between config mode and regular play mode
function toggleConfigMode() {
  isConfigMode = !isConfigMode;
  if (isConfigMode) {
    console.log('Entered configuration mode. Scan a card to configure it.');
  } else {
    console.log('Exited configuration mode. Cards will now trigger playback.');
  }
}

// Function to read and handle RFID cards
function startCardScanning() {
  setInterval(async function() {
    // Reset the device
    mfrc522.reset();
    
    // Check if a card is present
    let response = mfrc522.findCard();
    
    if (!response.status) {
      // No card found
      return;
    }
    
    // Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      console.log('Error reading card UID.');
      return;
    }
    
    // Process the card UID
    const uid = response.data;
    const cardUID = bufferToHex(uid);
    
    // Avoid repeated readings of the same card
    if (cardUID === lastScannedUID) {
      return;
    }
    
    lastScannedUID = cardUID;
    console.log('Card detected! UID:', cardUID);
    
    // Handle card based on mode
    if (isConfigMode) {
      // Configuration mode: Map card to album
      configureCard(cardUID);
    } else {
      // Regular mode: Play album for this card
      playCardAlbum(cardUID);
    }
    
    // Clear the last scanned UID after a delay
    setTimeout(() => {
      if (lastScannedUID === cardUID) {
        lastScannedUID = null;
      }
    }, 3000);
  }, 500);
}

// Function to configure a card with a Spotify album
function configureCard(cardUID) {
  rl.question('Enter Spotify Album ID to map to this card: ', async (albumId) => {
    if (albumId) {
      try {
        // Get album info to verify it's valid
        const album = await spotifyApi.getAlbum(albumId);
        console.log(`Mapping card to album: ${album.body.name} by ${album.body.artists[0].name}`);
        
        // Save the mapping
        await cardManager.mapCardToAlbum(cardUID, albumId);
        console.log('Card configured successfully!');
      } catch (error) {
        console.error('Error configuring card:', error.message);
      }
    }
  });
}

// Function to play the album mapped to a card
async function playCardAlbum(cardUID) {
  try {
    // Refresh token to ensure it's valid
    await refreshAccessToken();
    
    // Get the album ID for this card
    const albumId = await cardManager.getAlbumForCard(cardUID);
    
    if (!albumId) {
      console.log('No album mapped to this card. Scan in configuration mode to set up.');
      return;
    }
    
    // Get album info
    const album = await spotifyApi.getAlbum(albumId);
    console.log(`Playing album: ${album.body.name} by ${album.body.artists[0].name}`);
    
    // Start playing the album
    await spotifyApi.play({ context_uri: `spotify:album:${albumId}` });
  } catch (error) {
    console.error('Error playing album:', error.message);
    
    if (error.message.includes('NO_ACTIVE_DEVICE')) {
      console.log('No active Spotify device found. Please open Spotify on a device first.');
    }
  }
}

// Handle application termination
process.on('SIGINT', () => {
  console.log('Stopping RFID reader...');
  process.exit();
});

// Start the application
init();
```

### Step 5: Create Package.json

If you haven't already, create a package.json file:

```json
{
  "name": "spotify-rfid-player",
  "version": "1.0.0",
  "description": "RFID card-based Spotify album player",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "mfrc522-rpi": "^2.1.3",
    "node-persist": "^3.1.0",
    "rpi-softspi": "^1.0.5",
    "spotify-web-api-node": "^5.0.2"
  }
}
```

## Using the Application

1. **Initial Setup**:
   - Run the application: `npm start`
   - Follow the authentication link that appears
   - Login to Spotify and authorize the application

2. **Configuration Mode**:
   - Press `c` to enter configuration mode
   - Scan an RFID card
   - Enter the Spotify Album ID when prompted
   - The card is now mapped to that album

3. **Play Mode**:
   - Make sure you have an active Spotify device (open Spotify on your phone or computer)
   - Scan a configured card
   - The associated album will start playing on your active Spotify device

## Getting Spotify Album IDs

You can get a Spotify Album ID by:
1. Right-clicking an album in Spotify
2. Selecting "Share" → "Copy Album Link"
3. From the URL (e.g., `https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3`), extract the ID (the part after `/album/`)

## Troubleshooting

1. **Authentication Issues**:
   - Ensure your Client ID and Secret are correct
   - Check that your redirect URI is properly configured in the Spotify Developer Dashboard

2. **Playback Issues**:
   - Ensure you have an active Spotify device (the app needs somewhere to play music)
   - Verify you have a Spotify Premium account (the API requires Premium for playback control)

3. **RFID Reading Issues**:
   - Use the debugging tools from your RFID test application
   - Ensure cards are properly positioned over the reader

## Advanced Features (Future Enhancements)

1. **Web Interface**:
   - Create a web dashboard to manage card mappings visually

2. **Multiple Actions**:
   - Support for different actions like play album, play playlist, play artist, etc.

3. **Physical Controls**:
   - Add buttons for pause/play, skip track, etc.

4. **LED Feedback**:
   - Add LEDs to show status (connected, playing, error, etc.)

5. **Writing to Cards**:
   - Store the Spotify Album ID directly on the RFID card for a more portable solution

## Conclusion

This project combines RFID technology with the Spotify API to create a unique physical interface for digital music. With some creativity, you could expand this system to create custom music control solutions for your home or events.

Remember that the Spotify API has rate limits and requires a Premium account for playback control features.