/**
 * @file Image module that groups services and controllers together.
 */
import { Module } from '@nestjs/common';

import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImagesDatabase } from './images.database';
import { PrismaModule } from '../prisma.module';
import { RoutesModule } from '../routes/routes.module';

@Module({
  providers: [ImagesService, ImagesDatabase],
  controllers: [ImagesController],
  imports: [RoutesModule, PrismaModule],
})
export class ImagesModule {}
