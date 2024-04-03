/**
 * @file Route segments e2e tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { json } from 'express';
import * as request from 'supertest';

import { PrismaService } from '../../src/prisma.service';
import { RoutesSegmentsModule } from '../../src/routes.segments/routes.segments.module';
import * as testData from '../data';

describe('RoutesSegmentsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let routeId: number;
  let routeSegmentId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoutesSegmentsModule],
    }).compile();

    app = module.createNestApplication();
    app.use(json({ limit: '50mb' }));
    await app.init();

    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    const result = await prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "Route" (name, description) 
      VALUES ('e2e_test_route', 'e2e_test_description') RETURNING id`;
    routeId = result[0].id;

    const segmentResult = await prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "RouteSegment" ("routeId", name, description, coordinates) 
      VALUES (${routeId},
              'e2e_test_route_segment', 
              'e2e_test_route_segment_description', 
               ST_GeomFromText('LINESTRING Z(-71.160281 42.258729 0, -71.160837 42.259113 0,  -71.161144 42.25932 0)', 4326)
               ) RETURNING id`;
    routeSegmentId = segmentResult[0].id;

    await prisma.$queryRaw`
        SELECT "RouteSegment".id, "RouteSegment".name, ST_AsText(coordinates) AS coordinates 
        FROM "RouteSegment" 
        JOIN "Route" ON "RouteSegment"."routeId" = "Route".id
        WHERE "routeId" = ${routeId}`;
  });

  afterEach(async () => {
    await prisma.$queryRaw`DELETE FROM "Route" WHERE id=${routeId}`;
  });

  it('/routes/segment (GET) return the segment', () => {
    return request(app.getHttpServer())
      .get(`/routes/segment/${routeSegmentId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'e2e_test_route_segment');
        expect(res.body).toHaveProperty('coordinates', [
          [-71.160281, 42.258729, 0],
          [-71.160837, 42.259113, 0],
          [-71.161144, 42.25932, 0],
        ]);
      });
  });

  it('/routes/segment (GET) return the segment length', () => {
    return request(app.getHttpServer())
      .get(`/routes/segment/length/${routeSegmentId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toStrictEqual({ length: 0.001045983387526644 });
      });
  });

  it('/routes/segment (GET) return "404" if the route segment does not exists', () => {
    return request(app.getHttpServer()).get(`/routes/segment/${0}`).expect(404);
  });

  it('/routes/segment (POST) fails with less than two coordinates', () => {
    return request(app.getHttpServer())
      .post(`/routes/segment`)
      .send({
        name: testData,
        coordinates: [[0, 0, 0]],
      })
      .expect(400);
  });

  it('/routes/segment (POST) succeeds', () => {
    return request(app.getHttpServer())
      .post(`/routes/segment`)
      .send({
        name: testData.routeName,
        routeId,
        coordinates: [
          [0, 0, 0],
          [42, 42, 0],
        ],
      })
      .expect(201);
  });

  it('/routes/segment (POST) fails with more than 1.000.000 coordinates', () => {
    const coordinates = Array.from({ length: 1000001 }, (_, i) => [i, i]);

    return request(app.getHttpServer())
      .post(`/routes/segment`)
      .send({
        name: testData,
        coordinates,
        routeId,
      })
      .expect(400);
  });

  it('/routes/segment (POST) fails with mixed dimension coordinates', () => {
    return request(app.getHttpServer())
      .post(`/routes/segment`)
      .send({
        name: testData,
        coordinates: [
          [0, 0],
          [10, 10, 10],
        ],
        routeId,
      })
      .expect(400);
  });

  it('/routes/segment (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/routes/segment/${routeSegmentId}`)
      .send({
        name: 'updated_test_route',
        coordinates: [
          [30, 10, 0],
          [10, 30, 0],
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'updated_test_route');
        expect(res.body).toHaveProperty('coordinates', [
          [30, 10, 0],
          [10, 30, 0],
        ]);
      });
  });

  it('/routes/segment (PATCH) fails with invalid data', () => {
    return request(app.getHttpServer())
      .patch(`/routes/segment/${routeSegmentId}`)
      .send({})
      .expect(400);
  });

  it('/routes/segment (PATCH) fails with invalid id', () => {
    return request(app.getHttpServer())
      .patch(`/routes/segment/12345678`)
      .send({ name: 'name_only_test_route' })
      .expect(404);
  });

  it('/routes/segment (PATCH) with name only', () => {
    return request(app.getHttpServer())
      .patch(`/routes/segment/${routeSegmentId}`)
      .send({ name: 'name_only_test_route' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'name_only_test_route');
      });
  });

  it('/routes/segment (PATCH) with description only', () => {
    return request(app.getHttpServer())
      .patch(`/routes/segment/${routeSegmentId}`)
      .send({ description: 'description_only_test_route' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'description',
          'description_only_test_route',
        );
      });
  });

  it('/routes/segment (PATCH) with coordinates only', () => {
    return request(app.getHttpServer())
      .patch(`/routes/segment/${routeSegmentId}`)
      .send({
        coordinates: [
          [30, 10, 0],
          [10, 30, 0],
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('coordinates', [
          [30, 10, 0],
          [10, 30, 0],
        ]);
      });
  });
});
