const express = require('express');
const { readRFID, displayLCD } = require('../mock/gpio-mock');

const app = express();
app.use(express.json());

// Simulate RFID scan endpoint
app.post('/scan', (req, res) => {
  const tagId = readRFID();
  displayLCD(`Now Playing: Album for ${tagId}`);
  res.json({ success: true, tagId });
});

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
