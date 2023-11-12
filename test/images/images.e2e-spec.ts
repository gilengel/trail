import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as request from 'supertest';
import { PrismaService } from '../../src/prisma.service';
import { json } from 'express';
import { ImagesModule } from '../../src/images/images.module';
import { ensureExistanceOfStorageDirectory } from '../../src/images/test/test.helper';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from '../../src/interceptors/errors.interceptor';

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
      ]
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
      INSERT INTO "Image" (id, name, coordinates) 
      VALUES (${id}, 'test_image', ST_GeomFromText('POINT(1024 1024)', 4326))`;

  });

  afterEach(async () => {
    await prisma.$queryRaw`TRUNCATE "Image"`;
  });

  it('/images/ (POST)', () => {
    return request(app.getHttpServer())
      .post(`/images`)
      .set('Content-Type', 'multipart/form-data')
      .attach('files', 'src/images/test/with_geo_information.jpg')
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

  it('/images/ (GET) with coordinate', () => {
    return request(app.getHttpServer())
      .get(`/images?lon=1024&lat=1024&maxOffset=10`)
      .expect(200);
      
  });

  it('/images/ (GET) fails with wrong offset', () => {
    return request(app.getHttpServer())
      .get(`/images?lon=1024&lat=1024&maxOffset=-10`)
      .expect(400); 
  });

  it('/images/ (GET) returns "NotFound" if no images are found near a coordinate', () => {
    return request(app.getHttpServer())
      .get(`/images?lon=0&lat=0&maxOffset=1`)
      .expect(404); 
  });

  it('/images/ (GET) returns "BadRequest" with invalid location', () => {
    return request(app.getHttpServer())
      .get(`/images?lon=0&maxOffset=1`)
      .expect(400); 
  });
});
