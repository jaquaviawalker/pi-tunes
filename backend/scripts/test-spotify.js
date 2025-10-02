// Simple test script for running in the command line
// This demonstrates how to use your SpotifyClient class

import { SpotifyClient } from '../dist/src/SpotifyClient.js';

console.log('Starting Spotify API test...');

const client = new SpotifyClient();

console.log('Authenticating with Spotify...');
await client.authenticate();
console.log('Authentication successful!');

console.log('\nSearching for "Off the Wall" album...');
const albums = await client.searchAlbum('Off the Wall');
console.log(`Found ${albums.length} albums:`);
console.log(JSON.stringify(albums, null, 2));

console.log('\nSpotify API test completed successfully!');
