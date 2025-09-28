import { SpotifyClient } from '../src/SpotifyClient';

// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Define user-related routes
router.get('/scan/tag/off-the-wall', () => {
  res.send('List of users');
});

module.exports = Router;
