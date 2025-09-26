require('dotenv').config();
import SpotifyWebApi from 'spotify-web-api-node';

export class SpotifyClient {
  private authenticationStatus: boolean;
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.authenticationStatus = false;
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
  }

  public async authenticate(): Promise<void> {
    return new Promise((resolve) => {
      // Retrieve an access token.
      this.spotifyApi.clientCredentialsGrant().then(
        (data) => {
          this.authenticationStatus = true;

          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);

          // Save the access token so that it's used in future calls
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

  public async searchAlbum(
    query: string,
    options?: { limit?: number }
  ): Promise<any[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not Authenticated');
    }
    const searchOptions = {
      limit: options?.limit || 5,
    };
    try {
      const response = await this.spotifyApi.searchAlbums(query, searchOptions);

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
  public isAuthenticated(): boolean {
    return this.authenticationStatus;
  }
}
