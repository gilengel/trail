/**
 * @file Test data for image api.
 */
import { v4 as uuidv4 } from 'uuid';
import * as DTO from '../dto';
import { DB as EntityDB } from './images.database';

export const date = new Date('05 Jan 2000 12:15:00 GMT');

const uuid = uuidv4();

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DB {
  export const images: EntityDB.Image[] = [
    {
      id: uuid.toString(),
      name: '',
      timestamp: date,
      coordinates: 'POINT(47.17970059972222 10.893711999999999)',
      mime_type: 'image/jpeg',
    },
  ];

  const multipleDbImages: EntityDB.Image[] = [];

  for (let i = 0; i < 3; i++) {
    multipleDbImages.push({
      id: uuid.toString(),
      name: '',
      timestamp: date,
      coordinates: 'POINT(47.17970059972222 10.893711999999999)',
      mime_type: 'image/jpeg',
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Entities {
  export const newImageWithoutData: DTO.CreateImage = {
    buffer: undefined,
    name: '',
    mimeType: '',
    coordinates: [],
  };
  export const images: DTO.Image[] = [
    {
      id: uuid.toString(),
      name: 'not_implemented',
      timestamp: date,
      coordinates: [47.17970059972222, 10.893711999999999],
      url: `${uuid.toString()}.jpg`,
      mimeType: 'image/jpeg',
    },
  ];

  export const multipleImages: DTO.Image[] = [];

  for (let i = 0; i < 3; i++) {
    multipleImages.push({
      id: uuid.toString(),
      name: 'not_implemented',
      timestamp: date,
      coordinates: [47.17970059972222, 10.893711999999999],
      url: `${uuid.toString()}.jpg`,
      mimeType: 'image/jpeg',
    });
  }
}
