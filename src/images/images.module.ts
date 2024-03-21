/**
 * @file Image module that groups services and controllers together.
 */
import { Module } from '@nestjs/common';

import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaService } from '../prisma.service';
import { RoutesModule } from '../routes/routes.module';
import { RoutesSegmentsModule } from '../routes.segments/routes.segments.module';

@Module({
  providers: [ImagesService, PrismaService],
  controllers: [ImagesController],
  imports: [RoutesModule, RoutesSegmentsModule],
})
export class ImagesModule {}
