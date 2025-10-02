import * as dotenv from 'dotenv';
import { SpotifyDevice, SpotifyAlbum } from '../interfaces/SpotifyClient';
import logger from '../utils/logger';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

export type Code = string;

export type AlbumId = string;

export type DeviceId = string;

/**
 * Authentication strategy types for Spotify API
 */
export enum AuthType {
  CLIENT_CREDENTIALS = 'CLIENT_CREDENTIALS',
  AUTH_CODE = 'AUTH_CODE',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

/**
 * Client for interacting with the Spotify Web API.
 * Handles authentication, token management, and searching for music content.
 */
export class SpotifyClient {
  private code: Code;
  private albumId: AlbumId;
  private deviceId: DeviceId;

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
   * Authenticate with the Spotify API using the specified authentication type
   *
   * @param authType - Authentication strategy to use
   * @returns Promise that resolves when authentication is complete
   * @throws Error if authentication fails
   */
  public async authenticate(
    authType: AuthType = AuthType.CLIENT_CREDENTIALS
  ): Promise<void> {
    try {
      switch (authType) {
        case AuthType.CLIENT_CREDENTIALS:
          await this.authenticateWithClientCredentials();
          break;
        case AuthType.AUTH_CODE:
          if (!this.code) {
            throw new Error(
              'Authorization code is required for AUTH_CODE strategy'
            );
          }
          await this.authenticateWithAuthCode();
          break;
        case AuthType.REFRESH_TOKEN:
          await this.authenticateWithRefreshToken();
          break;
        default:
          throw new Error(`Unsupported authentication type: ${authType}`);
      }
    } catch (error) {
      logger.error('Authentication failed', {
        authType,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Authenticates with Spotify using client credentials flow.
   * @private
   */
  private async authenticateWithClientCredentials(): Promise<void> {
    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      this.authenticationStatus = true;
      this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;

      logger.info('Access token received', {
        expiresIn: data.body.expires_in,
        expirationTime: new Date(this.tokenExpirationTime).toISOString(),
      });

      this.spotifyApi.setAccessToken(data.body.access_token);
    } catch (err) {
      logger.error('Failed to get access token using client credentials', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
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

  /**
   * Authenticates with Spotify using authorization code.
   * @private
   */
  private async authenticateWithAuthCode(): Promise<void> {
    try {
      const data = await this.spotifyApi.authorizationCodeGrant(this.code);
      this.authenticationStatus = true;
      this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;

      logger.info('Auth code token received', {
        expiresIn: data.body.expires_in,
        expirationTime: new Date(this.tokenExpirationTime).toISOString(),
      });

      this.spotifyApi.setAccessToken(data.body.access_token);
      this.spotifyApi.setRefreshToken(data.body.refresh_token);
    } catch (err) {
      logger.error('Failed to get access token using auth code', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  /**
   * Refreshes the access token using the refresh token if necessary
   * @private
   */
  private async authenticateWithRefreshToken(): Promise<void> {
    if (!this.isTokenExpired() || !this.spotifyApi.getRefreshToken()) {
      return;
    }

    try {
      const data = await this.spotifyApi.refreshAccessToken();
      this.spotifyApi.setAccessToken(data.body.access_token);

      if (data.body.refresh_token) {
        this.spotifyApi.setRefreshToken(data.body.refresh_token);
      }

      this.tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
      this.authenticationStatus = true;

      logger.info('Access token refreshed', {
        expiresIn: data.body.expires_in,
        expirationTime: new Date(this.tokenExpirationTime).toISOString(),
      });
    } catch (err) {
      this.authenticationStatus = false;
      logger.error('Failed to refresh access token', {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  /**
   * @deprecated Use authenticate(AuthType.AUTH_CODE) instead
   */
  public async authCode(): Promise<void> {
    return this.authenticate(AuthType.AUTH_CODE);
  }

  /**
   * @deprecated Use authenticate(AuthType.REFRESH_TOKEN) instead
   */
  public async refreshAccessToken(): Promise<void> {
    return this.authenticate(AuthType.REFRESH_TOKEN);
  }
  /**
   * Ensures the client is authenticated before making API calls.
   * If not authenticated or the token is expired, it will authenticate using the specified strategy.
   *
   * @private
   * @param authType - Authentication strategy to use
   * @returns Promise that resolves when authentication is confirmed
   */
  private async ensureAuthentication(
    authType: AuthType = AuthType.CLIENT_CREDENTIALS
  ): Promise<void> {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      await this.authenticate(authType);
    }
  }

  /**
   * @deprecated Use ensureAuthentication(AuthType.CLIENT_CREDENTIALS) instead
   */
  private async ensureAuthenticated(): Promise<void> {
    return this.ensureAuthentication(AuthType.CLIENT_CREDENTIALS);
  }

  /**
   * @deprecated Use ensureAuthentication(AuthType.REFRESH_TOKEN) instead
   */
  private async ensureAuth(): Promise<void> {
    return this.ensureAuthentication(AuthType.REFRESH_TOKEN);
  }

  /**
   * Searches for albums on Spotify based on a query string.
   *
   * @param {string} query - The search query (album name, artist, etc.)
   * @param {Object} [options] - Optional search parameters
   * @param {number} [options.limit=5] - Maximum number of results to return
   * @returns {Promise<SpotifyAlbum[]>} Array of album objects with simplified properties
   * @throws {Error} If the search fails or authentication fails
   */
  public async searchAlbum(
    query: string,
    options?: { limit?: number }
  ): Promise<SpotifyAlbum[]> {
    await this.ensureAuthentication(AuthType.CLIENT_CREDENTIALS);
    const searchOptions = {
      limit: options?.limit || 5,
    };
    try {
      const response = await this.spotifyApi.searchAlbums(query, searchOptions);
      const albums = response.body.albums?.items || [];
      if (albums.length === 0) {
        console.log(`No albums found matching: ${query}`);
      }
      return albums.map((album) => ({
        id: album.id,
        name: album.name,
        artists: album.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        images: album.images.map((image) => ({
          url: image.url,
          height: image.height || 0,
          width: image.width || 0,
        })),
        release_date: album.release_date,
        total_tracks: album.total_tracks,
        uri: album.uri,
      }));
    } catch (error) {
      console.error('Error searching for albums:', error);
      throw error;
    }
  }

  /**
   * Gets available Spotify playback devices, returns the first device or null if none found
   *
   * @returns First available device or null if no devices found
   */
  public async getAvailableDevices(): Promise<SpotifyDevice | null> {
    await this.ensureAuthentication(AuthType.REFRESH_TOKEN);
    try {
      const response = await this.spotifyApi.getMyDevices();
      const devices = response.body.devices || [];
      if (devices.length === 0) {
        console.log('No devices found');
        return null;
      }
      const firstDevice = devices[0];

      const spotifyDevice: SpotifyDevice = {
        id: firstDevice.id || '',
        is_active: Boolean(firstDevice.is_active),
        is_private_session: Boolean(firstDevice.is_private_session),
        is_restricted: Boolean(firstDevice.is_restricted),
        name: firstDevice.name || '',
        type: firstDevice.type || '',
        volume_percent:
          firstDevice.volume_percent === null
            ? undefined
            : firstDevice.volume_percent,
      };

      return spotifyDevice;
    } catch (error) {
      console.error('Error getting devices', error);
      throw error;
    }
  }

  /**
   * Plays the currently set album on the currently set device
   *
   * @returns Promise that resolves when the album starts playing
   * @throws Error if playing fails or authentication fails
   */
  public async playAlbum(): Promise<void> {
    await this.ensureAuthentication(AuthType.REFRESH_TOKEN);
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
   * @returns True if authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    return this.authenticationStatus;
  }
  /**
   * Checks if the current authentication token has expired or is about to expire.
   * Includes a threshold buffer time before actual expiration.
   *
   * @private
   * @returns True if the token is expired or will expire soon, false otherwise
   */
  private isTokenExpired(): boolean {
    if (!this.tokenExpirationTime) {
      return true;
    }
    return (
      Date.now() > this.tokenExpirationTime - this.tokenExpirationThreshold
    );
  }
  /**
   * Sets the Spotify album ID to be used for playback
   *
   * @param albumId - Spotify album ID
   */
  public setAlbumId(albumId: string): void {
    this.albumId = albumId;
  }

  /**
   * Sets the Spotify device ID to use for playback
   *
   * @param deviceId - Spotify device ID
   */
  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }
}
