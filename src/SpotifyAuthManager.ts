import SpotifyWebApi from 'spotify-web-api-node';
import * as dotenv from 'dotenv';

export class SpotifyAuthManager {
  private authenticationStatus: boolean;

  /**
   * The Spotify Web API instance used to make requests
   * @private
   */
  private spotifyApi: SpotifyWebApi;

  /**
   * Timestamp (in milliseconds) when the current authentication token will expire
   * @private
   */
  private tokenExpirationTime: number;

  /**
   * Buffer time (in milliseconds) before actual token expiration to trigger a refresh
   * @private
   */
  private tokenExpirationThreshold: number;

  constructor() {
    this.authenticationStatus = false;
    this.tokenExpirationTime = 0;
    this.tokenExpirationThreshold = 60000;
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
  }
}
