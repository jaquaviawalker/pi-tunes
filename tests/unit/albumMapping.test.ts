import { AlbumMapping } from '../../src/AlbumMapping';

//each RFID Tag needs to store UUID, spotify album ID, Album metadata
//EACH RFID TAG WILL BE MAPPED TO A KEY
//Each key wil be mapped to an album
let albumMap;
const tagId = '12345';
const albumId = '67890';
const newAlbumId = '9852089';

// Reset for each test
beforeEach(() => {
  albumMap = new AlbumMapping();
});

describe('should Tag to ablum mapping', () => {
  test('should add a new mapping when given valid tag and album ID', () => {
    albumMap.addMapping(tagId, albumId);

    const result = albumMap.getAlbumByTagId(tagId);
    expect(result).toBe(albumId);
  });
  // Test null input error
  test('should throw error if parameters are null', () => {
    expect(() => albumMap.addMapping(null, null)).toThrow(
      'Input cannot be empty'
    );
  });

  test('should throw error if parameters are a number ', () => {
    expect(() => albumMap.addMapping(123, 456)).toThrow(
      'Input must be a string'
    );
  });
  test('should remove album from given tagID', () => {
    albumMap.addMapping(tagId, albumId);

    let result = albumMap.getAlbumByTagId(tagId);
    expect(result).toBe(albumId);

    albumMap.removeMapping(tagId);

    result = albumMap.getAlbumByTagId(tagId);

    // If getAlbumByTagId returns null/undefined for missing tags:
    expect(result).toBeNull(); // or toBeUndefined() depending on implementation

    // OR if it returns an empty string:
  });
  test('should list all mappings ', () => {
    const emptyList = albumMap.listAllMappings();
    expect(emptyList).toHaveLength(0);

    albumMap.addMapping(tagId, albumId);
    albumMap.addMapping('anotherTag', 'anotherAlbum');

    const mappingsList = albumMap.listAllMappings();

    expect(mappingsList).toHaveLength(2);

    expect(mappingsList).toContainEqual({
      tagId: tagId,
      albumId: albumId,
    });
    expect(mappingsList).toContainEqual({
      tagId: 'anotherTag',
      albumId: 'anotherAlbum',
    });
  });
  test('should update a new mapping', () => {
    albumMap.addMapping(tagId, albumId);
    const result = albumMap.getAlbumByTagId(tagId);
    expect(result).toBe(albumId);

    albumMap.updateMapping(tagId, newAlbumId);
    const newResult = albumMap.getAlbumByTagId(tagId);
    expect(newResult).toBe(newAlbumId);
  });
});
