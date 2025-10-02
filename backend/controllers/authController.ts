import logger from '../../utils/logger';
import { Request, Response } from 'express';
import { SpotifyClient, AuthType } from '../../src/SpotifyClient';

export async function handleLogin(req: Request, res: Response) {
  try {
    const client = new SpotifyClient();
    res.redirect(client.userLogin());
  } catch (error) {
    logger.error('Login error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).send('Error initiating login process');
  }
}

export async function handleCallback(req: Request, res: Response) {
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
    client.setCode(code);
    await client.authenticate(AuthType.AUTH_CODE);
    res.send('Successfully authenticated with Spotify!');
  } catch (error) {
    logger.error('Authentication error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).send('Error during authentication');
  }
}
