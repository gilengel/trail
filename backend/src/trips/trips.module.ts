/**
 * @file Module for routes.
 */
import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PrismaModule } from '../prisma.module';
import { TripsDatabase } from './trips.database';

@Module({
  providers: [TripsService, TripsDatabase],
  controllers: [TripsController],
  imports: [PrismaModule],
  exports: [TripsService],
})
export class TripsModule {}
