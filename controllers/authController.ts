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
