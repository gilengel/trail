import * as fs from 'fs';

/**
 * Creates a fake image in the sense that the content is not valid.
 * Used for unit tests
 *
 * @param size Size of the fake image in bytes. Must be larger than 8 and magnitutes of 2
 */
/*
export function mockImage(size: number, name: string): File {
  let blob = new Blob([''.repeat(size / 8)], { type: 'image/png' });
  blob['lastModifiedDate'] = '';
  blob['name'] = name;

  return <File>blob;
}
*/

export function mockFileFromBuffer(buffer: Buffer): Express.Multer.File {
  return {
    fieldname: '',
    originalname: '',
    encoding: '',
    mimetype: '',
    buffer: buffer,
    size: 200000,
    stream: null,
    destination: null,
    filename: '',
    path: '',
  };
}

export function ensureExistanceOfStorageDirectory(): void {
  // ensure that the storage directory for the images exists
  fs.mkdir('./images', { recursive: true }, (err) => {
    if (err) throw err;
  });
}
