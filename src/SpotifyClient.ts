import * as dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

/**
 * Client for interacting with the Spotify Web API.
 * Handles authentication, token management, and searching for music content.
 */
export class SpotifyClient {
  /**
   * Indicates if the client is currently authenticated with Spotify
   * @private
   */
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

  public code: string;

  private albumId: string;

  private deviceId: string;

  /**
   * Creates a new SpotifyClient instance.
   * Initializes the Spotify Web API with credentials from environment variables.
   * @param {string} [code] - Optional authorization code for authCode flow
   */
  constructor() {
    this.code = '';
    this.deviceId = '';
    this.albumId = '';
    this.authenticationStatus = false;
    this.tokenExpirationTime = 0;
    this.tokenExpirationThreshold = 60000;
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
  }

  /**
   * Authenticates with Spotify using client credentials flow.
   * Sets the access token and updates the token expiration time.
   *
   * @returns {Promise<void>} A promise that resolves when authentication is complete
   */
  public async authenticate(): Promise<void> {
    return new Promise((resolve) => {
      this.spotifyApi.clientCredentialsGrant().then(
        (data) => {
          this.authenticationStatus = true;
          this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);

          this.spotifyApi.setAccessToken(data.body['access_token']);
          resolve();
        },
        (err) => {
          console.log(
            'Something went wrong when retrieving an access token',
            err
          );
        }
      );
    });
  }
  public generateRandomString(length: number) {
    let text = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public userLogin(): string {
    let state = this.generateRandomString(16);
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-read-playback-state',
    ];
    return this.spotifyApi.createAuthorizeURL(scopes, state);
  }

  public async authCode(): Promise<void> {
    try {
      const data = await this.spotifyApi.authorizationCodeGrant(this.code);
      this.authenticationStatus = true;
      this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
      console.log('The access token expires in ' + data.body.expires_in);
      console.log('The access token is ' + data.body.access_token);
      console.log('The access token is ' + data.body.refresh_token);

      this.spotifyApi.setAccessToken(data.body.access_token);
      this.spotifyApi.setRefreshToken(data.body.refresh_token);
    } catch (err) {
      console.error(
        'Something went wrong when retrieving an access token',
        err
      );
      throw err;
    }
  }

  public async refreshAccessToken(): Promise<void> {
    if (!this.isAuthenticated() || !this.isTokenExpired()) {
      return;
    }
    try {
      const data = await this.spotifyApi.refreshAccessToken();
      this.spotifyApi.setAccessToken(data.body['access_token']);
      if (data.body['refresh_token']) {
        this.spotifyApi.setRefreshToken(data.body['refresh_token']);
      }
      this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
      this.authenticationStatus = true;
      console.log('The access token has been refreshed.');
      console.log('The new access token expires in ' + data.body['expires_in']);
    } catch (err) {
      this.authenticationStatus = false;
      console.error('Could not refresh access token', err);
      throw err;
    }
  }
  /**
   * Ensures the client is authenticated before making API calls.
   * If not authenticated or the token is expired, it will authenticate.
   *
   * @private
   * @returns {Promise<void>} A promise that resolves when authentication is confirmed
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      await this.authenticate();
    }
  }

  private async ensureAuth(): Promise<void> {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      await this.refreshAccessToken();
    }
  }

  /**
   * Searches for albums on Spotify based on a query string.
   *
   * @param {string} query - The search query (album name, artist, etc.)
   * @param {Object} [options] - Optional search parameters
   * @param {number} [options.limit=5] - Maximum number of results to return
   * @returns {Promise<any[]>} Array of album objects with simplified properties
   * @throws {Error} If the search fails or authentication fails
   */
  public async searchAlbum(
    query: string,
    options?: { limit?: number }
  ): Promise<any[]> {
    await this.ensureAuthenticated();
    const searchOptions = {
      limit: options?.limit || 5,
    };
    try {
      const response = await this.spotifyApi.searchAlbums(query, searchOptions);
      const albums = response.body.albums?.items || [];
      if (albums.length === 0) {
        console.log(`No albums found matching: ${query}`);
      }
      return (
        response.body.albums?.items.map((album) => ({
          id: album.id,
          name: album.name,
          artist: album.artists[0]?.name,
          imageUrl: album.images[0]?.url,
        })) ?? []
      );
    } catch (error) {
      console.error('Error searching for albums:', error);
      throw error;
    }
  }

  public async getAvailableDevices(): Promise<any> {
    await this.ensureAuth();
    try {
      const response = await this.spotifyApi.getMyDevices();
      const devices = response.body.devices || [];
      if (devices.length === 0) {
        console.log('No devices found');
        return null;
      }
      const firstDevice = devices[0];
      return {
        id: firstDevice.id,
        is_active: firstDevice.is_active,
        is_private_session: firstDevice.is_private_session,
        is_restricted: firstDevice.is_restricted,
        name: firstDevice.name,
        type: firstDevice.type,
      };
    } catch (error) {
      console.error('Error getting devices', error);
      throw error;
    }
  }

  public async playAlbum(): Promise<void> {
    await this.ensureAuth();
    try {
      await this.spotifyApi.play({
        device_id: this.deviceId,
        context_uri: `spotify:album:${this.albumId}`,
      });
    } catch (error) {
      console.error('Error playing album', error);
      throw error;
    }
  }
  /**
   * Checks if the client is currently authenticated with Spotify.
   *
   * @returns {boolean} True if authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    return this.authenticationStatus;
  }
  /**
   * Checks if the current authentication token has expired or is about to expire.
   * Includes a threshold buffer time before actual expiration.
   *
   * @private
   * @returns {boolean} True if the token is expired or will expire soon, false otherwise
   */
  private isTokenExpired(): boolean {
    if (!this.tokenExpirationTime) {
      return true;
    }
    return (
      Date.now() > this.tokenExpirationTime - this.tokenExpirationThreshold
    );
  }
  public setAlbumId(albumId: string): void {
    this.albumId = albumId;
  }

  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }
}
