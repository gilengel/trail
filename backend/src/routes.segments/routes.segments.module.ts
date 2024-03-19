import { Module } from '@nestjs/common';
import { RoutesSegmentsService } from './routes.segments.service';
import { RoutesSegmentsController } from './routes.segments.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RoutesSegmentsController],
  providers: [RoutesSegmentsService, PrismaService],
  exports: [RoutesSegmentsService],
})
export class RoutesSegmentsModule {}
