/**
 * @file Conversion unit test cases.
 */
import { dbimage2dto, dbimages2dto, point2wkt, wkt2point } from './conversion';
import { DbImageDto, ImageDto } from './images/dto/image.dto';
import { v4 as uuidv4 } from 'uuid';

describe('Conversion', () => {
  it('convertes a 2d point to wkt string', () => {
    const result = point2wkt([8, 8]);
    expect(result).toBe('POINT(8 8)');
  });

  it('convertes a 3d point to wkt string', () => {
    const result = point2wkt([8, 8, 8]);
    expect(result).toBe('POINT(8 8 8)');
  });

  it('convertes a 2d wkt string to point', () => {
    const result = wkt2point('POINT(8 8)');
    expect(result).toStrictEqual([8, 8]);
  });

  it('convertes a ed wkt string to point', () => {
    const result = wkt2point('POINT(8 8 8)');
    expect(result).toStrictEqual([8, 8, 8]);
  });

  it('converts a db image to dto', () => {
    const uuid = uuidv4();
    const dbImage: DbImageDto = {
      id: uuid.toString(),
      timestamp: undefined,
      coordinates: 'POINT(1024 1024)',
      mime_type: 'image/jpeg',
    };

    const result = dbimage2dto(dbImage);
    const expected: ImageDto = {
      id: uuid.toString(),
      name: 'not_implemented',
      timestamp: undefined,
      coordinates: [1024, 1024],
      url: uuid.toString(),
    };

    expect(result).toStrictEqual(expected);
  });

  it('converts db images to dto', () => {
    const uuid = uuidv4();
    const dbImage: DbImageDto = {
      id: uuid.toString(),

      timestamp: undefined,
      coordinates: 'POINT(1024 1024)',
      mime_type: 'image/jpeg',
    };

    const result = dbimages2dto([dbImage]);
    const expected: ImageDto[] = [
      {
        id: uuid.toString(),
        name: 'not_implemented',
        timestamp: undefined,
        coordinates: [1024, 1024],
        url: uuid.toString(),
      },
    ];

    expect(result).toStrictEqual(expected);
  });
});
