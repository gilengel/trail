/**
 * @file Images e2e tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { v4 as uuidv4 } from 'uuid';
import * as request from 'supertest';

import { PrismaService } from '../../src/prisma.service';
import { ImagesModule } from '../../src/images/images.module';
import { ensureExistanceOfStorageDirectory } from '../../src/images/test/test.helper';
import { ErrorsInterceptor } from '../../src/interceptors/errors.interceptor';
import { json } from 'express';
import { RouteDto } from 'src/routes/dto/route.dto';
import * as async from 'async';
import { ImageDto } from 'src/images/dto/image.dto';

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

    ensureExistanceOfStorageDirectory();
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

  it.each([
    'with_geo_information.jpg',
    'with_geo_information.jpeg',
    'with_geo_information.tif',
  ])('/images/ (POST) %s', (image) => {
    return request(app.getHttpServer())
      .post(`/images`)
      .set('Content-Type', 'multipart/form-data')
      .attach('files', `src/images/test/${image}`)
      .expect(201);
  });

  it('/images/ (POST) fails with image without geo information (exif)', () => {
    return request(app.getHttpServer())
      .post(`/images`)
      .set('Content-Type', 'multipart/form-data')
      .attach('files', 'src/images/test/without_geo_information.jpg')
      .expect(400);
  });

  it('/images/ (POST) fails with a file that is not an image', () => {
    return request(app.getHttpServer())
      .post(`/images`)
      .set('Content-Type', 'multipart/form-data')
      .attach('files', 'src/images/test/no_image.txt')
      .expect(400);
  });

  it('/images/point (GET)', () => {
    return request(app.getHttpServer())
      .get(`/images/point?lon=1024&lat=1024&maxOffset=10`)
      .expect(200);
  });

  it('/images/point (GET) fails with wrong offset', () => {
    return request(app.getHttpServer())
      .get(`/images/point?lon=1024&lat=1024&maxOffset=-10`)
      .expect(400);
  });

  it('/images/point (GET) returns "NotFound" if no images are found near a point', () => {
    return request(app.getHttpServer())
      .get(`/images/point?lon=0&lat=0&maxOffset=1`)
      .expect(404);
  });

  it('/images/point (GET) returns 400 with invalid location', () => {
    return request(app.getHttpServer())
      .get(`/images/point?lon=0&maxOffset=1`)
      .expect(400);
  });

  it('/images/route_segment (GET) returns 400 with invalid route id', () => {
    const id = Number.MAX_SAFE_INTEGER;

    return request(app.getHttpServer())
      .get(`/images/route_segment?routeSegmentId=${id}&maxOffset=${500}`)
      .expect(400);
  });

  describe('GET', () => {
    let route: RouteDto;

    beforeEach(async () => {
      const result = await request(app.getHttpServer())
        .post(`/routes/gpx`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', 'src/routes/test/short.gpx');

      route = result.body;
    });

    it('/images/route_segment (GET) returns list of images near a route segment', async () => {
      const wrapper = new Promise((resolve, reject) => {
        async.waterfall(
          [
            (callback: request.CallbackHandler) => {
              request(app.getHttpServer())
                .post(`/images`)
                .set('Content-Type', 'multipart/form-data')
                .attach('files', `${__dirname}/data/20230909_102937.jpg`)
                .attach('files', `${__dirname}/data/20230909_102954.jpg`)
                .attach('files', `${__dirname}/data/20230909_105445.jpg`)
                .attach('files', `${__dirname}/data/20230909_105508.jpg`)
                .attach('files', `${__dirname}/data/20230909_105615.jpg`)
                .attach('files', `${__dirname}/data/20230909_110041.jpg`)
                .expect(201, callback);
            },

            (_: ImageDto[], callback: request.CallbackHandler) => {
              request(app.getHttpServer())
                .get(
                  `/images/route_segment?routeSegmentId=${
                    route.segments[0].id
                  }&maxOffset=${500}`,
                )
                .expect(200, callback);
            },
          ],
          (err: Error, results: unknown) => {
            if (err) return reject(err);
            return resolve(results);
          },
        );
      });

      return wrapper.then((data: ImageDto[]) => {
        expect(data.length == 6);
      });
    });

    it('/images/route_segment (GET) returns 400 for calling with an invalid (negative) offset', async () => {
      return request(app.getHttpServer())
        .get(
          `/images/route_segment?routeSegmentId=${
            route.segments[0].id
          }&maxOffset=${-1}`,
        )
        .expect(400);
    });

    it('/images/route_segment (GET) returns "404" if no images are saved for a trip', () => {
      return request(app.getHttpServer())
        .get(
          `/images/route_segment?routeSegmentId=${route.segments[0].id}&maxOffset=0`,
        )
        .expect(404);
    });

    it('/images/route_segment (GET) returns "404" if the requested route segment does not exist', async () => {
      return request(app.getHttpServer())
        .get(`/images/route_segment?routeSegmentId=${0}&maxOffset=${500}`)
        .expect(404);
    });

    afterEach(async () => {
      await prisma.$queryRaw`DELETE FROM "Route" WHERE id=${route.id}`;
    });
  });
});
