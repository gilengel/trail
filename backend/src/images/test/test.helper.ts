/**
 * @file Provide usefull functions for unit testing like mocking a file.
 */
import * as fs from 'fs';

/**
 * Creates a fake image in the sense that the content is not valid.
 * Used for unit tests.
 * @param size - Size of the fake image in bytes. Must be larger than 8 and magnitutes of 2.
 */
/*
export function mockImage(size: number, name: string): File {
  let blob = new Blob([''.repeat(size / 8)], { type: 'image/png' });
  blob['lastModifiedDate'] = '';
  blob['name'] = name;

  return <File>blob;
}
*/

// eslint-disable-next-line jsdoc/require-example
/**
 * Creates a file based on a buffer. This can be useful to unit test upload functionality.
 * @param buffer - The data that should be used to create the file.
 * @param mimetype - The mimetype of the mocked file
 * @returns File - The file. Be aware that it is not a proper file e.g. Mimetype, encoding and other important
 * members are not correctly set.
 */
export function mockFileFromBuffer(
  buffer: Buffer,
  mimetype?: string,
): Express.Multer.File {
  return {
    fieldname: '',
    originalname: '',
    encoding: '',
    mimetype: mimetype ? mimetype : '',
    buffer: buffer,
    size: 200000,
    stream: null,
    destination: null,
    filename: '',
    path: '',
  };
}

// eslint-disable-next-line jsdoc/require-example
/**
 * Ensure that the storage directory for the images exists.
 */
export function ensureExistanceOfStorageDirectory(): void {
  fs.mkdir('./images', { recursive: true }, (err) => {
    if (err) throw err;
  });
}
