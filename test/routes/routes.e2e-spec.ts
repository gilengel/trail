import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RoutesModule } from '../../src/route/routes.module';
import { PrismaService } from '../../src/prisma.service';
import * as testData from '../data';
import { DbRouteDto } from '../../src/route/dto/route.dto';
import { json } from 'express';

describe('RoutesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let route: DbRouteDto;

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
    await prisma.$executeRaw`
      INSERT INTO "Route" (name, coordinates) 
      VALUES ('e2e_test_route', ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)', 4326))`;

    route = await prisma.$queryRaw`
        SELECT id, name, ST_AsText(coordinates) 
        FROM "Route" 
        WHERE name = 'e2e_test_route'`;
    route = route[0];
  });

  afterEach(async () => {
    await prisma.$queryRaw`
      DELETE FROM "Route" 
      WHERE name = 'e2e_test_route' OR name = 'new_test_route';`;
  });

  it('/routes/ (GET)', () => {
    return request(app.getHttpServer()).get('/routes').expect(200);
  });

  it('/routes/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/routes/${route.id}`)
      .expect(200)
      .expect((res) =>
        expect(res.body).toHaveProperty('name', 'e2e_test_route'),
      );
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

  it('/routes/ (POST) fails with less than two coordinates', () => {
    return request(app.getHttpServer())
      .post(`/routes`)
      .send({
        name: testData,
        coordinates: [[0, 0]],
      })
      .expect(400);
  });

  it('/routes/ (POST) fails with more than 1.000.000 coordinates', () => {
    const coordinates = Array.from({ length: 1000001 }, (_, i) => [i, i]);

    return request(app.getHttpServer())
      .post(`/routes`)
      .send({
        name: testData,
        coordinates,
      })
      .expect(400);
  });

  it('/routes/ (POST) fails with mixed dimension coordinates', () => {
    return request(app.getHttpServer())
      .post(`/routes`)
      .send({
        name: testData,
        coordinates: [
          [0, 0],
          [10, 10, 10],
        ],
      })
      .expect(400);
  });

  it('/routes/ (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/routes/${route.id}`)
      .send({
        name: 'updated_test_route',
        coordinates: [
          [30, 10],
          [10, 30],
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'updated_test_route');
        expect(res.body).toHaveProperty('coordinates', [
          [30, 10],
          [10, 30],
        ]);
      });
  });

  it('/routes/ (PATCH) fails with invalid data', () => {
    return request(app.getHttpServer())
      .patch(`/routes/${route.id}`)
      .send({})
      .expect(400);
  });

  it('/routes/ (PATCH) fails with invalid id', () => {
    return request(app.getHttpServer())
      .patch(`/routes/12345678`)
      .send({ name: 'name_only_test_route' })
      .expect(404);
  });

  it('/routes/ (PATCH) with name only', () => {
    return request(app.getHttpServer())
      .patch(`/routes/${route.id}`)
      .send({ name: 'name_only_test_route' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'name_only_test_route');
      });
  });

  it('/routes/ (PATCH) with coordinates only', () => {
    return request(app.getHttpServer())
      .patch(`/routes/${route.id}`)
      .send({
        coordinates: [
          [30, 10],
          [10, 30],
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('coordinates', [
          [30, 10],
          [10, 30],
        ]);
      });
  });

  it('/routes/ (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/routes/${route.id}`)
      .expect(200);
  });
});
