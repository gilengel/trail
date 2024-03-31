/**
 * @file Routes parser unit test cases.
 */
import * as fs from 'fs';

import { extractCoordinatesFromGPX } from './routes.parser';
import { NotEnoughCoordinatesError } from '../routes.segments/routes.segments.service';

describe('RoutesParser', () => {
  it('should extract the coordinates of a segment from a gpx file', async () => {
    const data = fs.readFileSync('src/routes/test/short.gpx');

    const result = extractCoordinatesFromGPX(data);

    expect(result).toStrictEqual({
      name: 'Ehrwald Hiking',
      segments: [
        {
          name: 'Ehrwald Hiking',
          coordinates: [
            [
              '47.3875638283789157867431640625',
              '10.93997175805270671844482421875',
              '1127.800048828125',
            ],
            [
              '47.38756508566439151763916015625',
              '10.9399969875812530517578125',
              '1128',
            ],
            [
              '47.38756240345537662506103515625',
              '10.94002456404268741607666015625',
              '1128.199951171875',
            ],
          ],
        },
      ],
    });
  });

  it('should throw a NotEnoughCoordinatesError if there are no coordinates', async () => {
    const data = fs.readFileSync('src/routes/test/no_trk.gpx');
    const t = () => extractCoordinatesFromGPX(data);
    expect(t).toThrow(NotEnoughCoordinatesError);
  });

  it('should return "no_name" for the route name if not provided in the meta data', async () => {
    const data = fs.readFileSync('src/routes/test/no_name.gpx');
    const result = extractCoordinatesFromGPX(data);

    expect(result.name).toBe('no_name');
  });

  it('should return default to zero elevation if no elevation data is in the gpx file', async () => {
    const data = fs.readFileSync('src/routes/test/no_elevation.gpx');

    const result = extractCoordinatesFromGPX(data);

    expect(result).toStrictEqual({
      name: 'Ehrwald Hiking',
      segments: [
        {
          name: 'Ehrwald Hiking 1',
          coordinates: [
            [
              '47.3875638283789157867431640625',
              '10.93997175805270671844482421875',
              '0',
            ],
            [
              '47.38756508566439151763916015625',
              '10.9399969875812530517578125',
              '0',
            ],
            [
              '47.38756240345537662506103515625',
              '10.94002456404268741607666015625',
              '0',
            ],
          ],
        },
        {
          name: 'Ehrwald Hiking 2',
          coordinates: [
            [
              '47.3875638283789157867431640625',
              '10.93997175805270671844482421875',
              '0',
            ],
            [
              '47.38756508566439151763916015625',
              '10.9399969875812530517578125',
              '0',
            ],
            [
              '47.38756240345537662506103515625',
              '10.94002456404268741607666015625',
              '0',
            ],
          ],
        },
      ],
    });
  });

  it('should extract multiple segments from a gpx file', async () => {
    const data = fs.readFileSync('src/routes/test/short_multiple_segments.gpx');

    const result = extractCoordinatesFromGPX(data);

    expect(result).toStrictEqual({
      name: 'Ehrwald Hiking',
      segments: [
        {
          name: 'Ehrwald Hiking 1',
          coordinates: [
            [
              '47.3875638283789157867431640625',
              '10.93997175805270671844482421875',
              '1127.800048828125',
            ],
            [
              '47.38756508566439151763916015625',
              '10.9399969875812530517578125',
              '1128',
            ],
            [
              '47.38756240345537662506103515625',
              '10.94002456404268741607666015625',
              '1128.199951171875',
            ],
          ],
        },
        {
          name: 'Ehrwald Hiking 2',
          coordinates: [
            [
              '47.3875638283789157867431640625',
              '10.93997175805270671844482421875',
              '1127.800048828125',
            ],
            [
              '47.38756508566439151763916015625',
              '10.9399969875812530517578125',
              '1128',
            ],
            [
              '47.38756240345537662506103515625',
              '10.94002456404268741607666015625',
              '1128.199951171875',
            ],
          ],
        },
      ],
    });
  });
});
