/**
 * @file Images e2e tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { v4 as uuidv4 } from 'uuid';
import * as request from 'supertest';

import { PrismaService } from '../prisma.service';
import { ImagesModule } from './images.module';
import { ensureExistenceOfStorageDirectory } from './__test.helper__';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';
import { createTestTripWithoutRoutes } from '../routes/routes/routes.e2e-spec';
import * as DTO from '../dto';
import { join } from 'path';
import * as fs from 'fs';
import { json } from 'express';
import { IMAGES_URI, ImagesController } from './images.controller';

/**
 * Creates the URI for retrieving images from a route segment.
 * @param id - The id of the route segment from which you want to get the images of.
 * @param offset - Allowed offset of a coordinate to the route segment.
 * @param maxNumberOfImages - Optionally limiting the number of retrieved images.
 * @returns The correct URI pointing to the api endpoint to retrieve the images.
 */
function getRouteSegmentUri(
  id: number,
  offset: number,
  maxNumberOfImages?: number,
) {
  const url = `/${IMAGES_URI}/${ImagesController.ROUTE_SEGMENT_URI}/?${ImagesController.QUERY.ROUTE_SEGMENT_ID}=${id}&${ImagesController.QUERY.MAX_OFFSET}=${offset}`;
  if (maxNumberOfImages) {
    return `${url}&${ImagesController.QUERY.MAX_NUMBER_OF_IMAGES}=${maxNumberOfImages}`;
  }

  return url;
}

/**
 * Creates the URI for retrieving the number of images from a route segment.
 * @param id - The id of the route segment from which you want to get the images of.
 * @param offset - Allowed offset of a coordinate to the route segment.
 * @returns The correct URI pointing to the api endpoint to retrieve the number of images.
 */
function getRouteSegmentNumberUri(id: number, offset: number) {
  return `/${IMAGES_URI}/${ImagesController.ROUTE_SEGMENT_NUMBER_URI}/?${ImagesController.QUERY.ROUTE_SEGMENT_ID}=${id}&${ImagesController.QUERY.MAX_OFFSET}=${offset}`;
}

describe('ImagesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ImagesModule],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ErrorsInterceptor,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(json({ limit: '50mb' }));
    await app.init();

    prisma = module.get<PrismaService>(PrismaService);

    ensureExistenceOfStorageDirectory();
  });

  beforeEach(async () => {
    const id = uuidv4();
    await prisma.$executeRaw`
      INSERT INTO "Image" (id, name, coordinates, mime_type) 
      VALUES (${id}, 'test_image', ST_GeomFromText('POINT(1024 1024)', 4326), 'image/jpeg')`;
  });

  afterEach(async () => {
    await prisma.$queryRaw`TRUNCATE "Image"`;
  });

  const IMAGE_POINT_POST = `/${IMAGES_URI} (POST)`;
  describe(IMAGE_POINT_POST, () => {
    it.each([
      'with_geo_information.jpg',
      'with_geo_information.jpeg',
      'with_geo_information.tif',
    ])(`${IMAGE_POINT_POST} %s`, (image) => {
      return request(app.getHttpServer())
        .post(`/images`)
        .set('Content-Type', 'multipart/form-data')
        .attach('files', `src/images/__test_files__/${image}`)
        .expect(201);
    });

    it(`${IMAGE_POINT_POST} returns "400" if provided with image without geo information (exif)`, () => {
      return request(app.getHttpServer())
        .post(`/images`)
        .set('Content-Type', 'multipart/form-data')
        .attach(
          'files',
          'src/images/__test_files__/without_geo_information.jpg',
        )
        .expect(400);
    });

    it(`${IMAGE_POINT_POST} returns "400" if provided with a file that is not an image`, () => {
      return request(app.getHttpServer())
        .post(`/images`)
        .set('Content-Type', 'multipart/form-data')
        .attach('files', 'src/images/__test_files__/no_image.txt')
        .expect(400);
    });
  });

  const IMAGE_POINT_GET = `/${IMAGES_URI}/${ImagesController.POINT_URI} (GET)`;
  describe(IMAGE_POINT_GET, () => {
    it(`${IMAGE_POINT_GET} returns "200"`, () => {
      return request(app.getHttpServer())
        .get(`/images/point?lon=1024&lat=1024&maxOffset=10`)
        .expect(200);
    });

    it(`${IMAGE_POINT_GET} returns "400" if provided with wrong offset`, () => {
      return request(app.getHttpServer())
        .get(`/images/point?lon=1024&lat=1024&maxOffset=-10`)
        .expect(400);
    });

    it(`${IMAGE_POINT_GET} returns "200" and an empty array if no images are found near a point`, () => {
      return request(app.getHttpServer())
        .get(`/images/point?lon=0&lat=0&maxOffset=1`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toStrictEqual([]);
        });
    });

    it(`${IMAGE_POINT_GET} returns "400" with invalid location`, () => {
      return request(app.getHttpServer())
        .get(`/images/point?lon=0&maxOffset=1`)
        .expect(400);
    });
  });

  const IMAGE_ROUTE_SEGMENT_GET = `/${IMAGES_URI}/${ImagesController.ROUTE_SEGMENT_URI} (GET)`;
  describe(`${IMAGE_ROUTE_SEGMENT_GET}`, () => {
    let route: DTO.Route;
    let tripId: number;

    beforeEach(async () => {
      const gpxFilePath = join(
        __dirname,
        '../routes/routes/__test_files__',
        'short.gpx',
      );
      expect(fs.existsSync(gpxFilePath)).toBeTruthy();

      tripId = await createTestTripWithoutRoutes(prisma);
      const result = await request(app.getHttpServer())
        .post(`/routes/gpx`)
        .set('Content-Type', 'multipart/form-data')
        .field('name', 'short')
        .field('tripId', tripId)
        .attach('files', gpxFilePath);

      route = result.body;
    });

    afterEach(async () => {
      await prisma.routeSegment.delete({ where: { id: route.segments[0].id } });
      await prisma.route.delete({ where: { id: route.id } });
      await prisma.trip.delete({ where: { id: tripId } });
    });

    describe('multiple images', () => {
      beforeEach(async () => {
        return request(app.getHttpServer())
          .post(`/images`)
          .set('Content-Type', 'multipart/form-data')
          .attach('files', `${__dirname}/__test_files__/20230909_102937.jpg`)
          .attach('files', `${__dirname}/__test_files__/20230909_102954.jpg`)
          .attach('files', `${__dirname}/__test_files__/20230909_105445.jpg`)
          .attach('files', `${__dirname}/__test_files__/20230909_105508.jpg`)
          .attach('files', `${__dirname}/__test_files__/20230909_105615.jpg`)
          .attach('files', `${__dirname}/__test_files__/20230909_110041.jpg`)
          .expect(201);
      });

      it(`${IMAGE_ROUTE_SEGMENT_GET} returns list of images near a route segment`, () => {
        return request(app.getHttpServer())
          .get(getRouteSegmentNumberUri(route.segments[0].id, 500))
          .expect(200)
          .expect((result) => {
            expect(result.body).toStrictEqual({ count: 6 });
          });
      });

      it(`${IMAGE_ROUTE_SEGMENT_GET} returns the number of images near a route segment`, () => {
        return request(app.getHttpServer())
          .get(getRouteSegmentNumberUri(route.segments[0].id, 500))
          .expect(200)
          .expect((result) => {
            expect(result.body).toStrictEqual({ count: 6 });
          });
      });

      it(`${IMAGE_ROUTE_SEGMENT_GET} returns list of images near a route segment limited by given max number of images`, () => {
        return request(app.getHttpServer())
          .get(getRouteSegmentUri(route.segments[0].id, 500, 3))
          .expect(200)
          .expect((result) => {
            expect(result.body.length).toEqual(3);
          });
      });

      it(`${IMAGE_ROUTE_SEGMENT_GET} returns "400" with invalid route id`, () => {
        const id = Number.MAX_SAFE_INTEGER;

        return request(app.getHttpServer())
          .get(getRouteSegmentUri(id, 500))
          .expect(400);
      });
    });

    it(`${IMAGE_ROUTE_SEGMENT_GET} returns "400" for calling with an invalid (negative) offset`, () => {
      return request(app.getHttpServer())
        .get(getRouteSegmentUri(route.segments[0].id, -1))
        .expect(400);
    });

    it(`${IMAGE_ROUTE_SEGMENT_GET} returns "200" with an empty array if no images are saved for the route segment`, () => {
      return request(app.getHttpServer())
        .get(getRouteSegmentUri(route.segments[0].id, 0))
        .expect(200)
        .expect((result) => {
          expect(result.body).toStrictEqual([]);
        });
    });

    it(`${IMAGE_ROUTE_SEGMENT_GET} returns "422" if the requested route segment does not exist`, () => {
      return request(app.getHttpServer())
        .get(getRouteSegmentUri(0, 500))
        .expect(422);
    });

    it(`returns "404" for the number of images near a route segment if the segment does not exist`, () => {
      return request(app.getHttpServer())
        .get(getRouteSegmentNumberUri(0, 0))
        .expect(422);
    });

    it(`/number returns "200" and {count: 0} if no images are near a route segment`, () => {
      return request(app.getHttpServer())
        .get(getRouteSegmentNumberUri(route.segments[0].id, 0))
        .expect(200)
        .expect((result) => {
          expect(result.body).toStrictEqual({ count: 0 });
        });
    });
  });
});
