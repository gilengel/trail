/**
 * @file Trips e2e tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../prisma.service';
import { TripsModule } from './trips.module';

import { createTestTripWithoutRoutes } from '../routes/routes/routes.e2e-spec';
import * as TripTestData from './__data__';
import { json } from 'express';
import { TRIPS_URI } from './trips.controller';

describe('TripsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let tripId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TripsModule],
    }).compile();

    app = module.createNestApplication();
    app.use(json({ limit: '50mb' }));
    await app.init();
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    tripId = await createTestTripWithoutRoutes(prisma);
  });

  afterEach(async () => {
    await prisma.trip.delete({
      where: { id: tripId },
    });
  });

  const TRIPS_POST = `/${TRIPS_URI} (POST)`;
  it(`${TRIPS_POST}`, () => {
    return request(app.getHttpServer())
      .post(`/trips`)
      .send(TripTestData.newTrip)
      .expect(201)
      .expect(async (res) => {
        expect(res.body).toHaveProperty('layout', {});

        await prisma.$queryRaw`DELETE FROM "Trip" WHERE id=${res.body.id}`;
      });
  });


  it('/trips/ (GET)', () => {
    return request(app.getHttpServer()).get('/trips').expect(200);
  });

  it('/trips/:id (GET)', () => {
    return request(app.getHttpServer()).get(`/trips/${tripId}`).expect(200);
  });

  it('/trips/:id (GET) returns "404" for nonexistent route', () => {
    return request(app.getHttpServer()).get(`/trips/123456789`).expect(404);
  });

  const TRIPS_PATCH = `/${TRIPS_URI} (PATCH)`;
  describe(`${TRIPS_PATCH}`, () => {
    it('succeeds changing the layout', () => {
      return request(app.getHttpServer())
        .patch(`/trips/${tripId}`)
        .send({
          layout: { row: [{ column: 'id' }] },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('layout', {
            row: [{ column: 'id' }],
          });
        });
    });

    it('resets the layout to default if not provided', () => {
      return request(app.getHttpServer())
        .patch(`/trips/${tripId}`)
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('layout', null);
        });
    });

    it('returns "404" for a non existing trip', () => {
      return request(app.getHttpServer())
        .patch(`/trips/123456789`)
        .send({
          layout: { row: [{ column: 'id' }] },
        })
        .expect(404);
    });
  });


  it('/trips/ (DELETE)', async () => {
    const tempTripId = await createTestTripWithoutRoutes(prisma);
    await request(app.getHttpServer())
      .delete(`/trips/${tempTripId}`)
      .expect(200);
  });
});
