/**
 * @file Module for routes.
 */
import { Module } from '@nestjs/common';
import { RoutesController } from './routes/routes.controller';
import { RoutesService } from './routes/routes.service';
import { RoutesDatabase } from './routes/routes.database';
import { PrismaModule } from '../prisma.module';
import { RoutesSegmentsController } from './segments/route.segments.controller';
import { RouteSegmentsService } from './segments/route.segments.service';
import { RouteSegmentsDatabase } from './segments';
import { TripsModule } from '../trips/trips.module';

@Module({
  providers: [
    RoutesService,
    RoutesDatabase,
    RouteSegmentsService,
    RouteSegmentsDatabase,
  ],
  controllers: [RoutesController, RoutesSegmentsController],
  exports: [
    RoutesService,
    RoutesDatabase,
    RouteSegmentsService,
    RouteSegmentsDatabase,
  ],
  imports: [TripsModule, PrismaModule],
})
export class RoutesModule {}
