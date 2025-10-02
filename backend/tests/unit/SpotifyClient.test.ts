import { SpotifyClient } from '../../src/SpotifyClient';
import SpotifyWebApi from 'spotify-web-api-node';

jest.mock('spotify-web-api-node');

describe('SpotifyClient', () => {
  // Mock credentials grant for all tests
  beforeEach(() => {
    // Mock the clientCredentialsGrant method on the prototype
    jest
      .spyOn(SpotifyWebApi.prototype, 'clientCredentialsGrant')
      .mockImplementation(() => {
        return Promise.resolve({
          body: {
            access_token: 'mock-token',
            token_type: 'bearer',
            expires_in: 3600,
          },
        } as any);
      });

    jest
      .spyOn(SpotifyWebApi.prototype, 'authorizationCodeGrant')
      .mockImplementation(() => {
        return Promise.resolve({
          body: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
          },
        } as any);
      });

    // Mock the setAccessToken method that will be called during authentication
    jest
      .spyOn(SpotifyWebApi.prototype, 'setAccessToken')
      .mockImplementation(() => {
        return undefined;
      });
  });

  test('should be created successfully', () => {
    const spotifyClient = new SpotifyClient();
    expect(spotifyClient).toBeTruthy();
  });
  test('should authenticate and get an access token', async () => {
    const spotifyClient = new SpotifyClient();
    expect(spotifyClient.isAuthenticated()).toBe(false);

    await spotifyClient.authenticate();
    expect(spotifyClient.isAuthenticated()).toBe(true);
  });

  test('should authenticate and provide access token', async () => {
    const spotifyClient = new SpotifyClient();
    expect(spotifyClient.isAuthenticated()).toBe(false);

    await spotifyClient.authCode();
    expect(spotifyClient.isAuthenticated()).toBe(true);
  });

  test('should search album', async () => {
    const mockAlbumData = {
      body: {
        albums: {
          items: [
            {
              id: '123456',
              name: 'Test Album',
              artists: [{ name: 'Test Artist' }],
              images: [{ url: 'https://example.com/image.jpg' }],
            },
          ],
        },
      },
    };

    // Mock the searchAlbums method for this specific test
    const searchAlbumsSpy = jest
      .spyOn(SpotifyWebApi.prototype, 'searchAlbums')
      .mockImplementation(() => {
        return Promise.resolve(mockAlbumData as any);
      });

    const spotifyClient = new SpotifyClient();
    await spotifyClient.authenticate();

    const result = await spotifyClient.searchAlbum('Test Album');

    expect(result).toBeTruthy();
    expect(result[0].name).toBe('Test Album');
    expect(result[0].artist).toBe('Test Artist');

    // Verify Spotify API was called correctly
    expect(searchAlbumsSpy).toHaveBeenCalledWith('Test Album', { limit: 5 });
  });
});
