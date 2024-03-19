import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { PrismaService } from '../prisma.service';
import { RoutesSegmentsModule } from '../routes.segments/routes.segments.module';

@Module({
  providers: [RoutesService, PrismaService],
  controllers: [RoutesController],
  exports: [RoutesService],
  imports: [RoutesSegmentsModule],
})
export class RoutesModule {}
