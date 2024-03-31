/**
 * @file Routes e2e tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RoutesModule } from '../../src/routes/routes.module';
import { PrismaService } from '../../src/prisma.service';
import * as testData from '../data';
import { json } from 'express';

describe('RoutesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let routeId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoutesModule],
    }).compile();

    app = module.createNestApplication();
    app.use(json({ limit: '50mb' }));
    await app.init();

    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    const result = await prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "Route" (name) 
      VALUES ('e2e_test_route') RETURNING id`;
    routeId = result[0].id;

    await prisma.$queryRaw`
        SELECT "RouteSegment".id, "RouteSegment".name, ST_AsText(coordinates) AS coordinates 
        FROM "RouteSegment" 
        JOIN "Route" ON "RouteSegment"."routeId" = "Route".id
        WHERE "routeId" = ${routeId}`;
  });

  afterAll(async () => {
    await prisma.route.deleteMany();
  });

  it('/routes/ (GET)', () => {
    return request(app.getHttpServer()).get('/routes').expect(200);
  });

  it('/routes/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/routes/${routeId}`)
      .expect(200)
      .expect((res) =>
        expect(res.body).toHaveProperty('name', 'e2e_test_route'),
      );
  });

  it('/routes/:id (GET) returns "404" for nonexisting route', () => {
    return request(app.getHttpServer()).get(`/routes/123456789`).expect(404);
  });

  it('/routes/ (POST)', () => {
    return request(app.getHttpServer())
      .post(`/routes`)
      .send(testData.newRoute)
      .expect(201)
      .expect((res) =>
        expect(res.body).toHaveProperty('name', 'new_test_route'),
      );
  });

  it('/routes/ (POST) fails with a track containing invalid (not enough) coordinates', () => {
    return request(app.getHttpServer())
      .post(`/routes`)
      .send({
        name: 'invalid_test_route',
        segments: [
          {
            name: 'invalid_segment',
            coordinates: [[0]],
          },
        ],
      })
      .expect(400);
  });

  it('/routes/gpx (POST) succeeds with a single segment track', () => {
    return request(app.getHttpServer())
      .post(`/routes/gpx`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'src/routes/test/short.gpx')
      .expect(201)
      .expect((res) =>
        expect(res.body).toHaveProperty('name', 'Ehrwald Hiking'),
      );
  });

  it('/routes/gpx (POST) succeeds with a single segment track without elevation', () => {
    return request(app.getHttpServer())
      .post(`/routes/gpx`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'src/routes/test/no_elevation.gpx')
      .expect(201)
      .expect((res) =>
        expect(res.body).toHaveProperty('name', 'Ehrwald Hiking'),
      );
  });

  it('/routes/gpx (POST) succeeds with a multi segment track', () => {
    return request(app.getHttpServer())
      .post(`/routes/gpx`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'src/routes/test/long.gpx')
      .expect(201)
      .expect((res) =>
        expect(res.body).toHaveProperty(
          'name',
          'Stage 1: Arctic Ocean to Väylä — European Divide Trail',
        ),
      );
  });

  it('/routes/gpx (POST) sets the route name to "no_name" if not provided within the metadata in the gpx file', () => {
    return request(app.getHttpServer())
      .post(`/routes/gpx`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'src/routes/test/no_name.gpx')
      .expect(201)
      .expect((res) => expect(res.body).toHaveProperty('name', 'no_name'));
  });

  it('/routes/gpx (POST) fails with less than two coordinates', () => {
    return request(app.getHttpServer())
      .post(`/routes/gpx`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'src/routes/test/empty.gpx')
      .expect(400);
  });

  it('/routes (PATCH) succeeds changing the name', () => {
    return request(app.getHttpServer())
      .patch(`/routes/${routeId}`)
      .send({
        name: 'updated_test_route',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'updated_test_route');
      });
  });

  it('/routes (PATCH) fails if no name attribute is send to the backend', () => {
    return request(app.getHttpServer())
      .patch(`/routes/${routeId}`)
      .send({})
      .expect(400);
  });

  it('/routes (PATCH) fails if the route does not exists', () => {
    return request(app.getHttpServer())
      .patch(`/routes/${12345678}`)
      .send({
        name: 'irrelevant_name',
      })
      .expect(404);
  });

  it('/routes/ (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/routes/${routeId}`)
      .expect(200);
  });
});
