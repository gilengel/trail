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
import { env } from 'node:process';

/**
 * Creates a trip in the database that has no related routes.
 * @param prisma - Prisma instance.
 * @returns ID of the created trip.
 */
export async function createTestTripWithoutRoutes(prisma): Promise<number> {
  const trip = await prisma.trip.create({
    data: {
      name: 'e2e trip',
      layout: {}, // Provide a valid JSON object for layout
    },
  });

  return trip.id;
}

/**
 * Creates a trip in the database that has no related routes.
 * @param prisma - Prisma instance.
 * @returns ID of the created trip.
 */
export async function createTestTripWithSingleRoute(
  prisma,
): Promise<{ tripId: number; routeId: number }> {
  const trip = await prisma.trip.create({
    data: {
      name: 'e2e trip',
      layout: {}, // Provide a valid JSON object for layout
      routes: {
        create: [
          {
            name: 'e2e_test_route',
            description: 'A sample route',
          },
        ],
      },
    },
    include: {
      routes: true,
    },
  });

  const tripId = trip.id;
  const routeId = trip.routes[0].id;

  testData.newRoute.tripId = tripId;
  testData.newRouteWithoutSegments.tripId = tripId;

  return { tripId, routeId };
}

describe('RoutesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let tripId: number;
  let routeId: number;

  // For testing with a broken database. For example if the schema is not applied.
  describe('without working database', () => {
    let databaseUrl: string = '';

    beforeAll(async () => {
      databaseUrl = env.DATABASE_URL;
      env.DATABASE_URL = env.BROKEN_DATABASE_URL;

      const module: TestingModule = await Test.createTestingModule({
        imports: [RoutesModule],
      }).compile();

      app = module.createNestApplication();
      app.use(json({ limit: '50mb' }));
      await app.init();

      prisma = module.get<PrismaService>(PrismaService);
    });

    afterAll(() => {
      env.DATABASE_URL = databaseUrl;
    });

    it('/routes/ (GET)', () => {
      return request(app.getHttpServer()).get('/routes').expect(400);
    });
  });

  describe('with working database', () => {
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
      const data = await createTestTripWithSingleRoute(prisma);
      tripId = data.tripId;
      routeId = data.routeId;
    });

    afterEach(async () => {
      await prisma.trip.delete({
        where: { id: tripId },
      });
    });

    it('/routes/ (GET)', () => {
      return request(app.getHttpServer()).get('/routes').expect(200);
    });

    it('/routes/trip/:id (GET)', () => {
      return request(app.getHttpServer())
        .get(`/routes/trip/${tripId}`)
        .expect(200);
    });

    it('/routes/:id (GET)', () => {
      return request(app.getHttpServer())
        .get(`/routes/${routeId}`)
        .expect(200)
        .expect((res) =>
          expect(res.body).toHaveProperty('name', 'e2e_test_route'),
        );
    });

    it('/routes/:id (GET) returns "404" for nonexistent route', () => {
      return request(app.getHttpServer()).get(`/routes/123456789`).expect(404);
    });

    it('/routes/ (POST)', () => {
      return request(app.getHttpServer())
        .post(`/routes`)
        .send(testData.newRoute)
        .expect(201)
        .expect(async (res) => {
          expect(res.body).toHaveProperty('name', 'new_test_route');

          await prisma.$queryRaw`DELETE FROM "Route" WHERE id=${res.body.id}`;
        });
    });

    it('/routes/ (POST) with empty route', () => {
      return request(app.getHttpServer())
        .post(`/routes`)
        .send({
          tripId,
        })
        .expect(201)
        .expect(async (res) => {
          expect(res.body).toHaveProperty('segments', []);
          expect(res.body).not.toHaveProperty('description', '');
          expect(res.body).not.toHaveProperty('description', '');

          await prisma.$queryRaw`DELETE FROM "Route" WHERE id=${res.body.id}`;
        });
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
        .field('name', 'Ehrwald Hiking')
        .field('tripId', tripId)
        .attach('files', 'src/routes/test/short.gpx')
        .expect(201)
        .expect(async (res) => {
          expect(res.body).toHaveProperty('name', 'Ehrwald Hiking');

          await prisma.$queryRaw`DELETE FROM "Route" WHERE id=${res.body.id}`;
        });
    });

    it('/routes/gpx (POST) succeeds with a single segment track without elevation', () => {
      return request(app.getHttpServer())
        .post(`/routes/gpx`)
        .set('Content-Type', 'multipart/form-data')
        .field('name', 'Ehrwald Hiking')
        .field('tripId', tripId)
        .attach('files', 'src/routes/test/no_elevation.gpx')
        .expect(201)
        .expect(async (res) => {
          expect(res.body).toHaveProperty('name', 'Ehrwald Hiking');

          await prisma.$queryRaw`DELETE FROM "Route" WHERE id=${res.body.id}`;
        });
    });

    it('/routes/gpx (POST) succeeds with a multi segment track', () => {
      return request(app.getHttpServer())
        .post(`/routes/gpx`)
        .set('Content-Type', 'multipart/form-data')
        .field('name', 'Stage 1: Arctic Ocean to Väylä — European Divide Trail')
        .field('tripId', tripId)
        .attach('files', 'src/routes/test/long.gpx')
        .expect(201)
        .expect(async (res) => {
          expect(res.body).toHaveProperty(
            'name',
            'Stage 1: Arctic Ocean to Väylä — European Divide Trail',
          );

          await prisma.$queryRaw`DELETE FROM "Route" WHERE id=${res.body.id}`;
        });
    });

    it('/routes/gpx (POST) fails with less than two coordinates', () => {
      return request(app.getHttpServer())
        .post(`/routes/gpx`)
        .set('Content-Type', 'multipart/form-data')
        .field('name', 'empty')
        .attach('files', 'src/routes/test/empty.gpx')
        .expect(400);
    });

    it('/routes (PATCH) succeeds changing only the name', () => {
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

    it('/routes (PATCH) succeeds changing only the description', () => {
      return request(app.getHttpServer())
        .patch(`/routes/${routeId}`)
        .send({
          description: 'updated_test_description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'description',
            'updated_test_description',
          );
        });
    });

    it('/routes (PATCH) succeeds changing name and description', () => {
      return request(app.getHttpServer())
        .patch(`/routes/${routeId}`)
        .send({
          name: 'updated_test_route',
          description: 'updated_test_description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'description',
            'updated_test_description',
          );
          expect(res.body).toHaveProperty('name', 'updated_test_route');
        });
    });

    it('/routes (PATCH) fails if no name and no description attribute is send to the backend', () => {
      return request(app.getHttpServer())
        .patch(`/routes/${tripId}`)
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
});
