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

export interface TagMapping {
  albumId: string;
  metadata?: AlbumMetadata;
}

export interface MappingResult {
  tagId: string;
  albumId: string;
}

export interface MappingsCollection {
  [tagId: string]: TagMapping;
}
