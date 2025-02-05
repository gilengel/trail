/**
 * @file Trips e2e tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/prisma.service';
import * as testData from '../data';
import { json } from 'express';
import { TripsModule } from '../../src/trips/trips.module';

describe('TripsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TripsModule],
    }).compile();

    app = module.createNestApplication();
    app.use(json({ limit: '50mb' }));
    await app.init();

    prisma = module.get<PrismaService>(PrismaService);
  });

  it('/trips/ (POST)', () => {
    return request(app.getHttpServer())
      .post(`/trips`)
      .send(testData.newTrip)
      .expect(201)
      .expect(async (res) => {
        expect(res.body).toHaveProperty('layout', {});

        await prisma.$queryRaw`DELETE FROM "Trip" WHERE id=${res.body.id}`;
      });
  });
});
