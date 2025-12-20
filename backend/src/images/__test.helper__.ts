/**
 * @file Provide useful functions for unit testing like mocking a file.
 */
import * as fs from 'fs';
import { Express } from 'express';
import { Buffer } from 'buffer';

/**
 * Creates a fake image in the sense that the content is not valid.
 * Used for unit tests.
 * @param size - Size of the fake image in bytes. Must be larger than 8 and magnitudes of 2.
 */
/*
export function mockImage(size: number, name: string): File {
  let blob = new Blob([''.repeat(size / 8)], { type: 'image/png' });
  blob['lastModifiedDate'] = '';
  blob['name'] = name;

  return <File>blob;
}
*/

/**
 * Creates a file based on a buffer. This can be useful to unit test upload functionality.
 * @param buffer - The data that should be used to create the file.
 * @param mimetype - The mimetype of the mocked file.
 * @returns File - The file. Be aware that it is not a proper file e.g. Mimetype, encoding and other important.
 * @example
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

/**
 * Ensure that the storage directory for the images exists.
 */
export function ensureExistenceOfStorageDirectory(): void {
  fs.mkdir('./images', { recursive: true }, (err) => {
    if (err) throw err;
  });
}
