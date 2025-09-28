import express from 'express';

const app = express();
app.use(express.json());

// Basic route for Task 5A - "Hello World" response
app.get('/', (req, res) => {
  res.send('Hello World! Welcome to the RFID Spotify Player API');
});

app.get('/scan/:tagId', (req, res) => {
  try {
    const tagId = req.params.tagId;
    if (!tagId || tagId == '') {
      throw new Error('No valid Tag Id Exists');
    }
    if (!/^[A-Fa-f0-9]{8,20}$/.test(tagId)) {
      throw new Error('Invalid tag format');
    }
    console.log(`Tag ID: ${tagId}`);
    res.status(200).json({
      success: true,
      tagId: tagId,
      message: 'Tag scanned successfully',
    });
  } catch (error) {
    console.error('Error scanning Tag', error);
    res.status(400).json({ success: false, error: error.message });
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
