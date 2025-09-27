export interface AlbumMetadata {
  albumName: string;
  artistName: string;
  imageUrl: string;
  // Optional additional properties
  releaseDate?: Date;
  genre?: string;
  duration?: number; // in seconds
  trackCount?: number;
}
