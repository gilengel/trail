/**
 * @file Module for routes.
 */
import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TripsService, PrismaService],
  controllers: [TripsController],
  exports: [TripsService],
})
export class TripsModule {}
